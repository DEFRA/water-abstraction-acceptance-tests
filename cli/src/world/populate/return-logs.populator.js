import GenerateReturnLogsService from 'water-abstraction-engine/services/return-logs/generate-return-logs.service.js'
import { determineReturnsPeriods } from 'water-abstraction-engine/lib/return-periods.lib.js'
import { data as primaryPurposes } from 'water-abstraction-engine/db/seeds/data/primary-purposes.js'
import { data as purposes } from 'water-abstraction-engine/db/seeds/data/purposes.js'
import { data as secondaryPurposes } from 'water-abstraction-engine/db/seeds/data/secondary-purposes.js'
import {
  determineCycleDueDate,
  determineCycleEndDate,
  determineCycleStartDate
} from 'water-abstraction-engine/lib/return-cycle-dates.lib.js'

import { addDays, formatDateToIso, today } from '../../../../tests/support/helpers/date.helpers.js'
import { licenceEndDate, licenceModel } from './helpers/end-dates.helpers.js'
import returnLogData from '../../../../tests/support/data/return-log.data.js'

// The first year the engine seeds return cycles for. Return logs can only be made for a cycle that has been seeded.
const FIRST_RETURN_CYCLE_YEAR = 1959

// The date many licences were revoked on. Hardly any of the licences revoked on it have return logs.
const REVOKED_ON = '2005-03-31'

// Return logs that end before this were imported from NALD. Those that end on or after it were made in the service.
const NALD_RETURN_LOGS_END_DATE = '2025-04-01'

// Return logs imported from NALD that end before this were mostly never completed.
const COMPLETED_IN_NALD_FROM = '1999-04-01'

// How many days after it ended an old NALD return log that was completed was received, where it has a received date.
const OLD_NALD_RECEIVED_DAYS_AFTER_END = 281

/**
 * Give the licences their return logs
 *
 * Each licence is given an empty list for its return logs. Then the licences that have return logs get one for each
 * return cycle, from each return requirement of their current return versions, as the service makes them. Those that
 * end before 1 April 2025 are then completed as the import from NALD left them, and the rest are completed as they are
 * in the service.
 *
 * Where a step takes the next value from a list, it goes back to the start of the list when it runs out.
 *
 * Call this after the return versions have been added, as the return logs are made from their return requirements.
 *
 * @param {object[]} licenceEntities - the licence entities to give return logs
 */
export default function returnLogs(licenceEntities) {
  _addReturnLogLists(licenceEntities)
  _addReturnLogs(licenceEntities)
  _completeNaldReturnLogs(licenceEntities)
  _completeServiceReturnLogs(licenceEntities)
}

/**
 * Give every licence an empty list for its return logs
 *
 * @private
 */
function _addReturnLogLists(licenceEntities) {
  for (const licenceEntity of licenceEntities) {
    licenceEntity.returnLogs = []
  }
}

/**
 * Give the licences that have return logs one for each return cycle, from each return requirement of their current
 * return versions
 *
 * The return logs are made by the engine's generate return logs service, which the service uses. It works out each
 * return log's dates from the licence, return version and return cycle, splits it into quarters where the return
 * version is for quarterly returns, and leaves out those where the licence or return version had ended before the
 * cycle started. Only cycles on the same summer or winter and all year cycle as the return requirement are used, from
 * the first year the licence has return logs.
 *
 * The return logs of a licence that started before 1990 often start years after it did, so each such licence takes the
 * next year from a list for its return logs to start from. Null is from when the licence started.
 *
 * It is told to set the due date of return logs that end before 1 April 2025, as these were all imported from NALD,
 * which always set it.
 *
 * Superseded return versions are left out, as their return logs would have been voided.
 *
 * @private
 */
function _addReturnLogs(licenceEntities) {
  const FIRST_RETURN_LOG_YEARS = [null, null, 1985, 1993, 1997]

  const returnCycles = _returnCycles()
  const withReturnLogs = _withReturnLogs(licenceEntities)

  const oldLicenceEntities = withReturnLogs.filter((licenceEntity) => {
    return licenceEntity.licence.startDate < '1990-01-01'
  })

  for (const licenceEntity of withReturnLogs) {
    const oldIndex = oldLicenceEntities.indexOf(licenceEntity)
    const firstYear = oldIndex === -1 ? null : FIRST_RETURN_LOG_YEARS[oldIndex % FIRST_RETURN_LOG_YEARS.length]

    _addLicenceReturnLogs(licenceEntity, returnCycles, firstYear)
  }
}

/**
 * Add the return logs of one licence, from the return cycles its return logs start from
 *
 * @private
 */
function _addLicenceReturnLogs(licenceEntity, returnCycles, firstYear) {
  const endDate = licenceEndDate(licenceEntity)
  const firstDate = _firstDate(licenceEntity, endDate, firstYear)

  const currentReturnVersions = licenceEntity.returnVersions.filter((returnVersion) => {
    return returnVersion.status === 'current'
  })

  for (const returnVersion of currentReturnVersions) {
    const returnRequirements = licenceEntity.returnRequirements.filter((returnRequirement) => {
      return returnRequirement.returnVersionId === returnVersion.id
    })

    for (const returnRequirement of returnRequirements) {
      const fetchedReturnRequirement = _fetchedReturnRequirement(licenceEntity, returnVersion, returnRequirement)

      for (const returnCycle of returnCycles) {
        if (returnCycle.summer !== returnRequirement.summer) {
          continue
        }

        if (formatDateToIso(returnCycle.endDate) < firstDate) {
          continue
        }

        const generatedReturnLogs = GenerateReturnLogsService(
          fetchedReturnRequirement,
          returnCycle,
          endDate ? new Date(endDate) : null,
          true
        )

        for (const generatedReturnLog of generatedReturnLogs) {
          licenceEntity.returnLogs.push(_returnLog(licenceEntity, returnRequirement, generatedReturnLog, returnCycle))
        }
      }
    }
  }
}

/**
 * Build a return log from the return log data file, made as the generated one
 *
 * It is built from the return log data file for its licence, return requirement, purposes, points and dates, then
 * given every value the generate return logs service worked out for it, so it is as the service makes it. Its dates
 * are YYYY-MM-DD strings, as the other populators use. It is due until it is completed.
 *
 * One that ends before 1 April 2025 was imported from NALD, and already has its due date. One that ends on or after it
 * was made in the service. Once it has ended it has the due date of its return cycle, or of its quarter for quarterly
 * returns, as the service sets it when the returns are sent out. One that has not ended yet has no due date, as the
 * service gives it.
 *
 * @private
 */
function _returnLog(licenceEntity, returnRequirement, generatedReturnLog, returnCycle) {
  const returnRequirementPurposes = licenceEntity.returnRequirementPurposes.filter((returnRequirementPurpose) => {
    return returnRequirementPurpose.returnRequirementId === returnRequirement.id
  })

  const points = licenceEntity.returnRequirementPoints
    .filter((returnRequirementPoint) => {
      return returnRequirementPoint.returnRequirementId === returnRequirement.id
    })
    .map((returnRequirementPoint) => {
      return licenceEntity.points.find((point) => {
        return point.id === returnRequirementPoint.pointId
      })
    })

  const returnLog = returnLogData(
    licenceEntity.licence,
    returnRequirement,
    returnRequirementPurposes,
    points,
    generatedReturnLog,
    { naldRegionId: licenceEntity.licence.regionId.value }
  )

  Object.assign(returnLog, generatedReturnLog)

  returnLog.startDate = formatDateToIso(generatedReturnLog.startDate)
  returnLog.endDate = formatDateToIso(generatedReturnLog.endDate)
  returnLog.dueDate = generatedReturnLog.dueDate ? formatDateToIso(generatedReturnLog.dueDate) : null
  returnLog.receivedDate = null

  if (returnLog.endDate < NALD_RETURN_LOGS_END_DATE) {
    returnLog.source = 'NALD'
  } else if (returnLog.endDate < formatDateToIso(today())) {
    returnLog.dueDate = _periodDueDate(returnLog, returnCycle)
  }

  return returnLog
}

/**
 * Complete the return logs imported from NALD, as the import left them
 *
 * Of those that end before 1 April 1999, every 4th was completed, and every 7th of those has a received date. Of those
 * that end on or after it, all were completed but every 9th, and all of those but every 25th have a received date, the
 * next number of days after it ended from a list.
 *
 * @private
 */
function _completeNaldReturnLogs(licenceEntities) {
  const OLD_COMPLETED_EVERY = 4
  const OLD_RECEIVED_EVERY = 7
  const DUE_EVERY = 9
  const NOT_RECEIVED_EVERY = 25
  const RECEIVED_DAYS_AFTER_END = [3, 20, 39, 90, 297]

  const naldReturnLogs = _allReturnLogs(licenceEntities).filter((returnLog) => {
    return returnLog.source === 'NALD'
  })

  const oldCompletedReturnLogs = naldReturnLogs
    .filter((returnLog) => {
      return returnLog.endDate < COMPLETED_IN_NALD_FROM
    })
    .filter((_returnLog, index) => {
      return index % OLD_COMPLETED_EVERY === OLD_COMPLETED_EVERY - 1
    })

  const oldReceivedReturnLogs = oldCompletedReturnLogs.filter((_returnLog, index) => {
    return index % OLD_RECEIVED_EVERY === OLD_RECEIVED_EVERY - 1
  })

  for (const returnLog of oldCompletedReturnLogs) {
    returnLog.status = 'completed'
  }

  for (const returnLog of oldReceivedReturnLogs) {
    returnLog.receivedDate = addDays(returnLog.endDate, OLD_NALD_RECEIVED_DAYS_AFTER_END)
  }

  const completedReturnLogs = naldReturnLogs
    .filter((returnLog) => {
      return returnLog.endDate >= COMPLETED_IN_NALD_FROM
    })
    .filter((_returnLog, index) => {
      return index % DUE_EVERY !== DUE_EVERY - 1
    })

  const receivedReturnLogs = completedReturnLogs.filter((_returnLog, index) => {
    return index % NOT_RECEIVED_EVERY !== NOT_RECEIVED_EVERY - 1
  })

  for (const returnLog of completedReturnLogs) {
    returnLog.status = 'completed'
  }

  for (let i = 0; i < receivedReturnLogs.length; i++) {
    const days = RECEIVED_DAYS_AFTER_END[i % RECEIVED_DAYS_AFTER_END.length]

    receivedReturnLogs[i].receivedDate = addDays(receivedReturnLogs[i].endDate, days)
  }
}

/**
 * Complete the return logs made in the service whose due date has passed
 *
 * All but every 8th were completed, and were received the next number of days after they ended from a list for
 * quarterly or yearly returns, or today where that is later.
 *
 * @private
 */
function _completeServiceReturnLogs(licenceEntities) {
  const DUE_EVERY = 8
  const RECEIVED_DAYS_AFTER_END = {
    quarterly: [16, 23, 27, 28, 33],
    yearly: [3, 10, 20, 28, 66]
  }

  const todayDate = formatDateToIso(today())

  const completedReturnLogs = _allReturnLogs(licenceEntities)
    .filter((returnLog) => {
      return returnLog.source !== 'NALD' && returnLog.dueDate && returnLog.dueDate < todayDate
    })
    .filter((_returnLog, index) => {
      return index % DUE_EVERY !== DUE_EVERY - 1
    })

  for (let i = 0; i < completedReturnLogs.length; i++) {
    const returnLog = completedReturnLogs[i]
    const receivedDays = returnLog.quarterly ? RECEIVED_DAYS_AFTER_END.quarterly : RECEIVED_DAYS_AFTER_END.yearly
    const receivedDate = addDays(returnLog.endDate, receivedDays[i % receivedDays.length])

    returnLog.status = 'completed'
    returnLog.receivedDate = receivedDate < todayDate ? receivedDate : todayDate
  }
}

/**
 * The return logs of all the licences, in the order the licences are in
 *
 * @private
 */
function _allReturnLogs(licenceEntities) {
  return licenceEntities.flatMap((licenceEntity) => {
    return licenceEntity.returnLogs
  })
}

/**
 * The due date of the return cycle a return log is for, or of its quarter where it is for quarterly returns
 *
 * The quarters are worked out with the engine's return periods lib, as the service does. A return log is in the
 * quarter it starts in.
 *
 * @private
 */
function _periodDueDate(returnLog, returnCycle) {
  const periods = returnLog.quarterly ? determineReturnsPeriods(returnCycle) : [returnCycle]

  const period = periods.find((period) => {
    return (
      formatDateToIso(period.startDate) <= returnLog.startDate && formatDateToIso(period.endDate) >= returnLog.startDate
    )
  })

  return formatDateToIso(period.dueDate)
}

/**
 * The licences that have return logs, in the order the licences are in
 *
 * Whether a licence has return logs depends on how it ended. So the licences are grouped by that, and within each
 * group a set share have them, taking each licence in turn:
 *
 * - not ended, or ending in the future - all but every 7th
 * - expired - all but every 7th
 * - revoked on 31 March 2005 - every 12th
 * - revoked on any other date - every 2nd
 * - lapsed - every 4th
 *
 * A licence that ended in more than one way is grouped by the way it ended first, as the engine's licence model works
 * it out.
 *
 * @private
 */
function _withReturnLogs(licenceEntities) {
  const LIVE_NONE_EVERY = 7
  const EXPIRED_NONE_EVERY = 7
  const REVOKED_ON_EVERY = 12
  const REVOKED_EVERY = 2
  const LAPSED_EVERY = 4

  const grouped = Object.groupBy(licenceEntities, _ended)

  const selected = [
    ...(grouped.notEnded ?? []).filter((_licenceEntity, index) => {
      return index % LIVE_NONE_EVERY !== LIVE_NONE_EVERY - 1
    }),
    ...(grouped.expired ?? []).filter((_licenceEntity, index) => {
      return index % EXPIRED_NONE_EVERY !== EXPIRED_NONE_EVERY - 1
    }),
    ...(grouped.revokedOn ?? []).filter((_licenceEntity, index) => {
      return index % REVOKED_ON_EVERY === REVOKED_ON_EVERY - 1
    }),
    ...(grouped.revoked ?? []).filter((_licenceEntity, index) => {
      return index % REVOKED_EVERY === REVOKED_EVERY - 1
    }),
    ...(grouped.lapsed ?? []).filter((_licenceEntity, index) => {
      return index % LAPSED_EVERY === LAPSED_EVERY - 1
    })
  ]

  return licenceEntities.filter((licenceEntity) => {
    return selected.includes(licenceEntity)
  })
}

/**
 * How a licence ended, for grouping it by whether it has return logs
 *
 * @private
 */
function _ended(licenceEntity) {
  const ends = licenceModel(licenceEntity).$ends()

  if (!ends || formatDateToIso(ends.date) > formatDateToIso(today())) {
    return 'notEnded'
  }

  if (ends.reason === 'expired' || ends.reason === 'lapsed') {
    return ends.reason
  }

  if (formatDateToIso(ends.date) === REVOKED_ON) {
    return 'revokedOn'
  }

  return 'revoked'
}

/**
 * The date a licence's return logs start from, as YYYY-MM-DD
 *
 * A licence that started before 1990 has return logs from 1 April of the year it was given. They start from when the
 * licence started where it was given none, the licence started later, or the licence ended before then, as a licence
 * that has return logs has at least one. A licence that started from 1990 on has return logs from when it started.
 *
 * @private
 */
function _firstDate(licenceEntity, endDate, firstYear) {
  const { startDate } = licenceEntity.licence

  if (startDate >= '1990-01-01') {
    return startDate
  }

  if (!firstYear) {
    return startDate
  }

  const firstDate = `${firstYear}-04-01`

  if (endDate && firstDate > endDate) {
    return startDate
  }

  return firstDate > startDate ? firstDate : startDate
}

/**
 * A return requirement in the shape the generate return logs service expects, as the service fetches it
 *
 * The service fetches a return requirement with its return version, licence, points and purposes, and its dates as
 * `Date`s. A licence's area code is held in its `regions`, and its NALD region id is the value its region is looked up
 * by. Each purpose's legacy id and description come from the engine's seed data, which the world is seeded with.
 *
 * It relies on every return requirement having its points and a purpose, which is how the return versions populator
 * builds them.
 *
 * @private
 */
function _fetchedReturnRequirement(licenceEntity, returnVersion, returnRequirement) {
  const { licence } = licenceEntity

  return {
    ...returnRequirement,
    returnVersion: {
      startDate: new Date(returnVersion.startDate),
      endDate: returnVersion.endDate ? new Date(returnVersion.endDate) : null,
      multipleUpload: returnVersion.multipleUpload,
      quarterlyReturns: returnVersion.quarterlyReturns,
      licence: {
        areacode: licence.regions.historicalAreaCode,
        expiredDate: licence.expiredDate ? new Date(licence.expiredDate) : null,
        lapsedDate: licence.lapsedDate ? new Date(licence.lapsedDate) : null,
        licenceRef: licence.licenceRef,
        region: { naldRegionId: licence.regionId.value },
        revokedDate: licence.revokedDate ? new Date(licence.revokedDate) : null,
        startDate: new Date(licence.startDate)
      }
    },
    points: _points(licenceEntity, returnRequirement),
    returnRequirementPurposes: _purposes(licenceEntity, returnRequirement)
  }
}

/**
 * The points of a return requirement, as the service fetches them
 *
 * Our points only set their first grid reference, so the rest are null as they are in the database.
 *
 * @private
 */
function _points(licenceEntity, returnRequirement) {
  const returnRequirementPoints = licenceEntity.returnRequirementPoints.filter((returnRequirementPoint) => {
    return returnRequirementPoint.returnRequirementId === returnRequirement.id
  })

  return returnRequirementPoints.map((returnRequirementPoint) => {
    const point = licenceEntity.points.find((point) => {
      return point.id === returnRequirementPoint.pointId
    })

    return {
      description: point.description,
      ngr1: point.ngr1,
      ngr2: point.ngr2 ?? null,
      ngr3: point.ngr3 ?? null,
      ngr4: point.ngr4 ?? null
    }
  })
}

/**
 * The purposes of a return requirement, as the service fetches them, with each purpose's legacy id and description
 *
 * @private
 */
function _purposes(licenceEntity, returnRequirement) {
  const returnRequirementPurposes = licenceEntity.returnRequirementPurposes.filter((returnRequirementPurpose) => {
    return returnRequirementPurpose.returnRequirementId === returnRequirement.id
  })

  return returnRequirementPurposes.map((returnRequirementPurpose) => {
    return {
      alias: returnRequirementPurpose.alias,
      primaryPurpose: _seeded(primaryPurposes, returnRequirementPurpose.primaryPurposeId.value),
      purpose: _seeded(purposes, returnRequirementPurpose.purposeId.value),
      secondaryPurpose: _seeded(secondaryPurposes, returnRequirementPurpose.secondaryPurposeId.value)
    }
  })
}

/**
 * The legacy id and description of a seeded purpose, primary purpose or secondary purpose, found by its legacy id
 *
 * @private
 */
function _seeded(seedData, legacyId) {
  const { description } = seedData.find((seeded) => {
    return seeded.legacyId === String(legacyId)
  })

  return { legacyId: String(legacyId), description }
}

/**
 * The return cycles the engine seeds, as the generate return logs service expects them
 *
 * Worked out as the engine's return cycles seed does: a summer and a winter and all year cycle from each year from 1959
 * to this one, leaving out a winter and all year cycle that has not started yet. Each one's id is the lookup the load
 * service uses to find the seeded cycle by its start date, as no two cycles start on the same day.
 *
 * @private
 */
function _returnCycles() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const returnCycles = []

  for (let year = FIRST_RETURN_CYCLE_YEAR; year <= currentYear; year++) {
    const determinationDate = new Date(`${year}-04-01`)

    for (const summer of [true, false]) {
      const startDate = determineCycleStartDate(summer, determinationDate)

      if (!summer && startDate > now) {
        continue
      }

      returnCycles.push({
        id: {
          schema: 'public',
          table: 'returnCycles',
          lookup: 'startDate',
          value: formatDateToIso(startDate),
          select: 'id'
        },
        startDate,
        endDate: determineCycleEndDate(summer, determinationDate),
        dueDate: determineCycleDueDate(summer, determinationDate),
        summer
      })
    }
  }

  return returnCycles
}
