import { daysFromPeriod, monthsFromPeriod, weeksFromPeriod } from 'water-abstraction-engine/lib/dates.lib.js'

import buildReturnSubmissionEntity from '../../../../tests/support/entities/return-submission.entity.js'
import companyContactData from '../../../../tests/support/data/company-contact.data.js'
import contactData from '../../../../tests/support/data/contact.data.js'
import { licenceVersionOn } from './helpers/licence-versions.helpers.js'
import { purposesOn } from './helpers/purposes.helpers.js'
import returnSubmissionLineData from '../../../../tests/support/data/return-submission-line.data.js'
import { users } from '../../../../tests/support/default-values.js'

// Completed return logs that end on or after this, and have a received date, were submitted in the service. The rest
// were completed in NALD, and their submissions imported from it.
const SUBMITTED_IN_SERVICE_FROM = '2018-04-01'

// The user NALD's submissions were imported as, and the date they were last imported on.
const NALD_USER = 'imported.from@nald.gov.uk'
const NALD_IMPORTED_ON = '2025-05-09'

// The service records who created a submission from this date. Only internal users are recorded.
const CREATED_BY_FROM = '2025-06-10'

// How much of its purpose's annual quantity a return says was abstracted.
const TOTAL_SHARES = [0.03, 0.15, 0.4, 0.7, 0.95]

// Which lines inside the abstraction period have a quantity. 'zero' is all of them 0, 'mixed' is every 3rd 0 and the
// rest a quantity, and 'quantities' is all of them a quantity, for submissions completed in NALD and in the service.
const QUANTITY_PATTERNS = {
  nald: ['zero', 'mixed', 'zero', 'mixed', 'zero', 'quantities'],
  service: ['mixed', 'quantities', 'mixed', 'quantities', 'mixed', 'quantities', 'mixed', 'quantities', 'mixed']
}

// How a submission made in the service that is not a nil return was reported: 'volumes' is abstraction volumes from a
// meter, 'readings' is meter readings, and 'estimated' is estimated volumes with no meter.
const REPORTED = [
  'volumes',
  'readings',
  'volumes',
  'readings',
  'volumes',
  'readings',
  'volumes',
  'estimated',
  'readings',
  'volumes',
  'readings',
  'volumes',
  'readings',
  'volumes',
  'readings',
  'estimated'
]

// The reading a meter starts on, the first time a return requirement's returns are reported as meter readings. After
// that its meter starts on the reading its last return ended on.
const START_READINGS = [2500, 16000, 63000, 210000, 530000]

/**
 * Give the completed return logs their submissions and lines
 *
 * Each licence is given empty lists for its return submissions and lines. Then each completed return log is given one
 * submission, built from the return submission entity. One completed in NALD has the user it was imported as, and one
 * submitted in the service has the user that submitted it and the metadata for how it was reported. A submission that
 * is not a nil return has a line for each day, week or month of its return log, as the service splits it. The
 * entity's own lines are not used, as they are always 12 months from April. Last of all, the meter readings are added
 * to those reported as meter readings.
 *
 * Where a step takes the next value from a list, it goes back to the start of the list when it runs out.
 *
 * Call this after the return logs have been added.
 *
 * @param {object[]} licenceEntities - the licence entities to give return submissions
 */
export default function returnSubmissions(licenceEntities) {
  _addSubmissionLists(licenceEntities)

  const submitted = _addSubmissions(licenceEntities)

  _importedFromNald(submitted)
  _submittedInService(submitted)
  _externalSubmitters(licenceEntities, submitted)
  _reported(submitted)
  _addLines(submitted)
  _addMeterReadings(submitted)
}

/**
 * Give every licence empty lists for its return submissions and lines, and for the contacts of the licence holders
 * that submit them
 *
 * @private
 */
function _addSubmissionLists(licenceEntities) {
  for (const licenceEntity of licenceEntities) {
    licenceEntity.returnSubmissions = []
    licenceEntity.returnSubmissionLines = []
    licenceEntity.contacts = []
    licenceEntity.companyContacts = []
  }
}

/**
 * Give each completed return log a submission, and return each with its licence and return log
 *
 * A completed return log that ends on or after 1 April 2018 and has a received date was submitted in the service. The
 * rest were completed in NALD.
 *
 * @private
 */
function _addSubmissions(licenceEntities) {
  const submitted = []

  for (const licenceEntity of licenceEntities) {
    const completedReturnLogs = licenceEntity.returnLogs.filter((returnLog) => {
      return returnLog.status === 'completed'
    })

    for (const returnLog of completedReturnLogs) {
      const { returnSubmission } = buildReturnSubmissionEntity(returnLog, 0)

      returnSubmission.version = 1

      licenceEntity.returnSubmissions.push(returnSubmission)

      submitted.push({
        licenceEntity,
        returnLog,
        returnSubmission,
        inService: returnLog.endDate >= SUBMITTED_IN_SERVICE_FROM && !!returnLog.receivedDate,
        lines: []
      })
    }
  }

  return submitted
}

/**
 * Make the submissions of return logs completed in NALD as the import left them
 *
 * They were imported as the NALD user, with no metadata, on the date NALD's returns were last imported. Every 70th is a
 * nil return.
 *
 * @private
 */
function _importedFromNald(submitted) {
  const NIL_EVERY = 70

  const imported = submitted.filter((submission) => {
    return !submission.inService
  })

  for (let i = 0; i < imported.length; i++) {
    const { returnSubmission } = imported[i]

    returnSubmission.userId = NALD_USER
    returnSubmission.userType = 'system'
    returnSubmission.metadata = {}
    returnSubmission.createdAt = NALD_IMPORTED_ON
    returnSubmission.nilReturn = i % NIL_EVERY === NIL_EVERY - 1
    returnSubmission.createdBy = null
  }
}

/**
 * Set who submitted the submissions made in the service, and which are nil returns
 *
 * Every 10th was submitted by the billing and data user, and the rest by the licence holder, whose contact is added
 * next. It was submitted on the day the return log was received. Only an internal user submitting from the date the service started recording it is
 * recorded as having created it. 5 in 13 are nil returns, which have no metadata.
 *
 * @private
 */
function _submittedInService(submitted) {
  const INTERNAL_EVERY = 10
  const NIL_RETURNS = [false, true, false, true, false, false, true, false, true, false, false, true, false]

  const inService = submitted.filter((submission) => {
    return submission.inService
  })

  for (let i = 0; i < inService.length; i++) {
    const { returnLog, returnSubmission } = inService[i]
    const internal = i % INTERNAL_EVERY === INTERNAL_EVERY - 1
    returnSubmission.userId = internal ? users.BILLING_AND_DATA.username : null
    returnSubmission.userType = internal ? 'internal' : 'external'
    returnSubmission.metadata = {}
    returnSubmission.createdAt = returnLog.receivedDate
    returnSubmission.nilReturn = NIL_RETURNS[i % NIL_RETURNS.length]
    returnSubmission.createdBy =
      internal && returnLog.receivedDate >= CREATED_BY_FROM ? users.BILLING_AND_DATA.userId : null
  }
}

/**
 * Make the licence holder the submitter of each submission made by an external user
 *
 * An external submission was made by the company that held the licence on the day it was received. That company is
 * given a contact with an email the first time one of its submissions is found, built from the contact data files as
 * an additional contact, and every submission it made is by that email. The contact is kept with the licence the company
 * is kept on, as a company that holds more than one licence is kept on only one of them.
 *
 * @private
 */
function _externalSubmitters(licenceEntities, submitted) {
  const companies = new Map()
  const contacts = new Map()

  for (const licenceEntity of licenceEntities) {
    for (const company of licenceEntity.companies) {
      companies.set(company.id, { company, licenceEntity })
    }
  }

  const external = submitted.filter((submission) => {
    return submission.returnSubmission.userType === 'external'
  })

  for (const { licenceEntity, returnLog, returnSubmission } of external) {
    const companyId = _holderOn(licenceEntity, returnLog.receivedDate)

    if (!contacts.has(companyId)) {
      const { company, licenceEntity: companyLicenceEntity } = companies.get(companyId)
      const contact = contactData(company)

      companyLicenceEntity.contacts.push(contact)
      companyLicenceEntity.companyContacts.push(companyContactData(contact, company))

      contacts.set(companyId, contact)
    }

    returnSubmission.userId = contacts.get(companyId).email
  }
}

/**
 * The id of the company that held a licence on a date, or that held it last where the licence had ended by then
 *
 * A return log can be received after its licence ended, so it is the licence holder whose role started last on or
 * before the date. It relies on the licence having a licence holder from when it started, which is how the licences
 * and licence holders populators build its licence document roles.
 *
 * @private
 */
function _holderOn(licenceEntity, date) {
  const startedBy = licenceEntity.licenceDocumentRoles
    .filter((licenceDocumentRole) => {
      return licenceDocumentRole.licenceRoleId.value === 'licenceHolder' && licenceDocumentRole.startDate <= date
    })
    .sort((roleA, roleB) => {
      return roleA.startDate.localeCompare(roleB.startDate)
    })

  return startedBy.at(-1).companyId
}

/**
 * Give the submissions made in the service that are not nil returns the metadata for how they were reported
 *
 * Each takes the next way it was reported from a list: 7 in 16 as abstraction volumes and 7 in 16 as meter readings,
 * from a meter with its details given, and 2 in 16 as estimated volumes with no meter. Each meter has its own serial
 * number, numbered from 1. Every 5th meter for meter readings and every 10th for abstraction volumes shows a tenth of
 * what was abstracted, so has a multiplier of 10. The meter readings themselves are added once the lines are.
 *
 * @private
 */
function _reported(submitted) {
  const TIMES_TEN_EVERY = { readings: 5, volumes: 10 }

  const reportedSubmissions = submitted.filter((submission) => {
    return submission.inService && !submission.returnSubmission.nilReturn
  })

  const reportedAs = reportedSubmissions.map((_submission, index) => {
    return REPORTED[index % REPORTED.length]
  })

  const metered = reportedSubmissions.filter((_submission, index) => {
    return reportedAs[index] !== 'estimated'
  })

  const readings = reportedSubmissions.filter((_submission, index) => {
    return reportedAs[index] === 'readings'
  })

  const volumes = reportedSubmissions.filter((_submission, index) => {
    return reportedAs[index] === 'volumes'
  })

  for (let i = 0; i < reportedSubmissions.length; i++) {
    const submission = reportedSubmissions[i]

    if (reportedAs[i] === 'estimated') {
      submission.returnSubmission.metadata = _estimatedMetadata()

      continue
    }

    const sameKind = reportedAs[i] === 'readings' ? readings : volumes
    const timesTen =
      sameKind.indexOf(submission) % TIMES_TEN_EVERY[reportedAs[i]] === TIMES_TEN_EVERY[reportedAs[i]] - 1

    submission.returnSubmission.metadata = _meterMetadata(
      reportedAs[i] === 'readings' ? 'oneMeter' : 'abstractionVolumes',
      metered.indexOf(submission) + 1,
      timesTen ? 10 : 1
    )
  }
}

/**
 * The metadata the service gives a submission of estimated volumes with no meter
 *
 * @private
 */
function _estimatedMetadata() {
  return { meters: [], method: 'abstractionVolumes', units: 'm³', type: 'estimated', totalFlag: false }
}

/**
 * The metadata the service gives a submission from a meter with its details given
 *
 * @private
 */
function _meterMetadata(method, serial, multiplier) {
  return {
    meters: [
      {
        meterDetailsProvided: true,
        multiplier,
        manufacturer: 'Example meter',
        serialNumber: `SN${String(serial).padStart(6, '0')}`
      }
    ],
    method,
    units: 'm³',
    type: 'measured',
    totalFlag: false
  }
}

/**
 * Add a line for each day, week or month of the return log of each submission that is not a nil return
 *
 * A line outside the return log's abstraction period has no quantity. Inside it, a submission's lines are all zero,
 * every 3rd zero, or all a quantity, each taking the next from a list for where it came from. The lines that have a
 * quantity share the submission's total equally, which is the next share of its purpose's annual quantity from a list.
 * The lines were created with the submission, and an estimated submission's lines are estimated.
 *
 * @private
 */
function _addLines(submitted) {
  const MIXED_ZERO_EVERY = 3

  const withLines = submitted.filter((submission) => {
    return !submission.returnSubmission.nilReturn
  })

  const importedWithLines = withLines.filter((submission) => {
    return !submission.inService
  })

  const inServiceWithLines = withLines.filter((submission) => {
    return submission.inService
  })

  let mixedCount = 0
  let totalCount = 0

  for (const submission of withLines) {
    const { licenceEntity, returnLog, returnSubmission } = submission

    const pattern = submission.inService
      ? QUANTITY_PATTERNS.service[inServiceWithLines.indexOf(submission) % QUANTITY_PATTERNS.service.length]
      : QUANTITY_PATTERNS.nald[importedWithLines.indexOf(submission) % QUANTITY_PATTERNS.nald.length]

    const periods = _periods(returnLog)

    const quantified = periods.map((period) => {
      if (!_inAbstractionPeriod(period.endDate, returnLog.metadata.nald)) {
        return false
      }

      if (pattern === 'zero') {
        return 0
      }

      if (pattern === 'mixed') {
        mixedCount++

        if (mixedCount % MIXED_ZERO_EVERY === 0) {
          return 0
        }
      }

      return true
    })

    const linesWithQuantity = quantified.filter((value) => {
      return value === true
    }).length

    let quantity = 0

    if (linesWithQuantity) {
      const total = _annualQuantity(licenceEntity, returnLog) * TOTAL_SHARES[totalCount % TOTAL_SHARES.length]

      totalCount++
      quantity = Math.round((total / linesWithQuantity) * 1000) / 1000
    }

    for (let i = 0; i < periods.length; i++) {
      let lineQuantity = null

      if (quantified[i] === 0) {
        lineQuantity = 0
      } else if (quantified[i] === true) {
        lineQuantity = quantity
      }

      const line = returnSubmissionLineData(returnSubmission, periods[i])

      line.timePeriod = returnLog.returnsFrequency
      line.quantity = lineQuantity
      line.readingType = returnSubmission.metadata.type === 'estimated' ? 'estimated' : 'measured'
      line.userUnit = 'm³'
      line.createdAt = returnSubmission.createdAt

      submission.lines.push(line)
    }

    licenceEntity.returnSubmissionLines.push(...submission.lines)
  }
}

/**
 * Add the meter readings to the submissions reported as meter readings
 *
 * Readings are whole numbers, as a meter shows them, and a line's quantity is how much its reading went up times the
 * meter's multiplier, as the service works out the quantities from the readings. So each line's quantity is rounded to
 * a whole number of the multiplier, and each line that has a quantity has a reading, which is the reading before it
 * plus its quantity divided by the multiplier. A return requirement's meter starts on the reading its last meter
 * readings ended on, or the next start reading from a list the first time.
 *
 * @private
 */
function _addMeterReadings(submitted) {
  const lastReadings = new Map()

  let firstTimeCount = 0

  const meterReadings = submitted.filter((submission) => {
    return submission.returnSubmission.metadata.method === 'oneMeter'
  })

  for (const { returnLog, returnSubmission, lines } of meterReadings) {
    const meter = returnSubmission.metadata.meters[0]

    let startReading = lastReadings.get(returnLog.returnRequirementId)

    if (startReading === undefined) {
      startReading = START_READINGS[firstTimeCount % START_READINGS.length]
      firstTimeCount++
    }

    const readings = {}

    let reading = startReading

    for (const line of lines) {
      if (line.quantity === null) {
        continue
      }

      line.quantity = Math.round(line.quantity / meter.multiplier) * meter.multiplier
      reading += line.quantity / meter.multiplier
      readings[`${line.startDate}_${line.endDate}`] = reading
    }

    lastReadings.set(returnLog.returnRequirementId, reading)

    returnSubmission.metadata.meters[0] = { ...meter, units: 'm³', readings, startReading }
  }
}

/**
 * The days, weeks or months of a return log, as YYYY-MM-DD start and end dates
 *
 * Worked out with the engine's dates lib, as the service does. It works in local time, so the dates are given to it and
 * read back from it in local time, which keeps them the same on every machine.
 *
 * The engine leaves out a week that does not end inside the return log, so a weekly return log shorter than a week has
 * none. That one gets the week, Sunday to Saturday, that it starts in.
 *
 * @private
 */
function _periods(returnLog) {
  const SPLITTERS = { day: daysFromPeriod, week: weeksFromPeriod, month: monthsFromPeriod }

  const splitter = SPLITTERS[returnLog.returnsFrequency]

  if (!splitter) {
    throw new Error(`Return log ${returnLog.returnId} has no lines for frequency '${returnLog.returnsFrequency}'`)
  }

  const startDate = _localDate(returnLog.startDate)
  const periods = splitter(startDate, _localDate(returnLog.endDate))

  if (periods.length === 0) {
    const sunday = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - startDate.getDay())
    const saturday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + 6)

    periods.push({ startDate: sunday, endDate: saturday })
  }

  return periods.map((period) => {
    return { startDate: _isoDate(period.startDate), endDate: _isoDate(period.endDate) }
  })
}

/**
 * Whether a date is inside a return log's abstraction period, from its NALD metadata
 *
 * @private
 */
function _inAbstractionPeriod(date, nald) {
  const dayOfYear = Number(date.slice(5, 7)) * 100 + Number(date.slice(8, 10))
  const start = Number(nald.periodStartMonth) * 100 + Number(nald.periodStartDay)
  const end = Number(nald.periodEndMonth) * 100 + Number(nald.periodEndDay)

  if (start <= end) {
    return dayOfYear >= start && dayOfYear <= end
  }

  return dayOfYear >= start || dayOfYear <= end
}

/**
 * The annual quantity of the purpose a return log is for
 *
 * It is the quantity of the purpose on the licence version in force when the return log's return version started,
 * as that is the licence version its return requirement was made from.
 *
 * It relies on every return requirement having one purpose, which is how the return versions populator builds them,
 * and on the abstraction populator having given every purpose an annual quantity.
 *
 * @private
 */
function _annualQuantity(licenceEntity, returnLog) {
  const returnRequirement = licenceEntity.returnRequirements.find((returnRequirement) => {
    return returnRequirement.id === returnLog.returnRequirementId
  })

  const returnVersion = licenceEntity.returnVersions.find((returnVersion) => {
    return returnVersion.id === returnRequirement.returnVersionId
  })

  const returnRequirementPurpose = licenceEntity.returnRequirementPurposes.find((returnRequirementPurpose) => {
    return returnRequirementPurpose.returnRequirementId === returnRequirement.id
  })

  const licenceVersion = licenceVersionOn(licenceEntity, returnVersion.startDate)

  const licenceVersionPurpose = purposesOn(licenceEntity, licenceVersion).find((licenceVersionPurpose) => {
    return licenceVersionPurpose.purposeId.value === returnRequirementPurpose.purposeId.value
  })

  return licenceVersionPurpose.annualQuantity
}

/**
 * A YYYY-MM-DD date as a `Date` at midnight local time
 *
 * @private
 */
function _localDate(date) {
  const [year, month, day] = date.split('-').map(Number)

  return new Date(year, month - 1, day)
}

/**
 * A `Date` as YYYY-MM-DD, read in local time
 *
 * @private
 */
function _isoDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}
