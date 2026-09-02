import { generateReference } from 'water-abstraction-engine/test/generators.js'

import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { relativeToToday } from '../helpers/date.helpers.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'

export const title = 'Licence with all return log statuses'
export const description = 'Licence with return logs covering all possible statuses'

export default function () {
  const currentPeriod = _currentPeriod(calculatedDates())
  const previousPeriod = _previousPeriod(currentPeriod)

  const licenceEntity = buildLicenceEntity()
  const returnVersion = returnVersionData(licenceEntity.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.startDate = previousPeriod.startDate

  const periods = [
    _notDueYetPeriod(currentPeriod),
    _voidPeriod(currentPeriod),
    _duePeriod(previousPeriod),
    _overduePeriod(previousPeriod),
    _openPeriod(previousPeriod),
    _completedPeriod(previousPeriod)
  ]

  // The returns list page orders rows by start date desc, then return reference desc as a tie-breaker. Assigning
  // descending references here, highest first, keeps these return logs in the same order as `periods`, which the
  // internal and external returns list specs rely on to identify each status by array position.
  const referenceBase = generateReference()

  const results = periods.map((period, index) => {
    return _returnLog(licenceEntity, returnVersion, period, referenceBase - index)
  })

  return {
    ...licenceEntity,
    returnVersion,
    returnRequirements: results.map((result) => {
      return result.returnRequirement
    }),
    returnRequirementPoints: results.map((result) => {
      return result.returnRequirementPoint
    }),
    returnRequirementPurposes: results.map((result) => {
      return result.returnRequirementPurpose
    }),
    returnLogs: results.map((result) => {
      return result.returnLog
    })
  }
}

/**
 * Generate the period details for a 'COMPLETE' return log
 *
 * The end date is in the past, and the status is 'completed'. Though it won't change the status in the UI, we set the
 * 'due date' to be 29 days after the end date, to mimic the returns invitations having been sent the day after, which
 * automatically applies the 'due date' when the service confirms the notification has been successful.
 *
 * @private
 */
function _completedPeriod(previousPeriod) {
  const { startDate, endDate } = previousPeriod
  const dueDate = new Date(`${endDate.getFullYear()}-04-29`)

  return {
    startDate,
    endDate,
    dueDate,
    status: 'completed',
    quarterly: false
  }
}

/**
 * Helper method to transpose the current winter return cycle period dates from strings into Dates
 *
 * @private
 */
function _currentPeriod(calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  return {
    startDate: new Date(currentWinterReturnCycle.startDate),
    endDate: new Date(currentWinterReturnCycle.endDate)
  }
}

/**
 * Generate the period details for a 'DUE' return log
 *
 * The end date is in the past, and the status is 'due'. Setting the 'due date' 5 days in the future makes the UI
 * display it as `DUE`.
 *
 * @private
 */
function _duePeriod(previousPeriod) {
  const { startDate, endDate } = previousPeriod

  return {
    startDate,
    endDate,
    dueDate: relativeToToday(5),
    status: 'due',
    quarterly: false
  }
}

/**
 * Generate the period details for a 'NOT DUE YET' return log
 *
 * If a return log's end date is in the future, the UI will display the status as 'NOT DUE YET'.
 *
 * @private
 */
function _notDueYetPeriod(currentPeriod) {
  const { startDate, endDate } = currentPeriod

  return {
    startDate,
    endDate,
    dueDate: null,
    status: 'due',
    quarterly: false
  }
}

/**
 * Generate the period details for an 'OPEN' return log
 *
 * The end date is in the past, and the status is 'due'. Not setting the 'due date' will make the UI display it as
 * `OPEN`.
 *
 * @private
 */
function _openPeriod(previousPeriod) {
  const { startDate, endDate } = previousPeriod

  return {
    startDate,
    endDate,
    dueDate: null,
    status: 'due',
    quarterly: false
  }
}

/**
 * Generate the period details for a 'OVERDUE' return log
 *
 * The end date is in the past, and the status is 'due'. Setting the 'due date' to yesterday, i.e. in the past makes the
 * UI display it as `OVERDUE`.
 *
 * @private
 */
function _overduePeriod(previousPeriod) {
  const { startDate, endDate } = previousPeriod

  return {
    startDate,
    endDate,
    dueDate: relativeToToday(-1),
    status: 'due',
    quarterly: false
  }
}

/**
 * Helper method to clone the current period and set the dates back by one year
 *
 * If we don't clone the current period's dates, we'll be setting the current periods dates back by one year, and
 * simply returning references to its dates.
 *
 * @private
 */
function _previousPeriod(currentPeriod) {
  const startDate = new Date(currentPeriod.startDate)
  const endDate = new Date(currentPeriod.endDate)

  startDate.setFullYear(startDate.getFullYear() - 1)
  endDate.setFullYear(endDate.getFullYear() - 1)

  return { startDate, endDate }
}

/**
 * Builds a return requirement and return log for the given period, then applies the status and reference overrides
 * that can't be expressed through the shared data builders alone.
 *
 * @private
 */
function _returnLog(licenceEntity, returnVersion, period, reference) {
  const returnRequirement = returnRequirementData(returnVersion, licenceEntity.licenceVersionPurpose)

  returnRequirement.legacyId = reference
  returnRequirement.reference = reference

  const returnRequirementPoint = returnRequirementPointData(returnRequirement, licenceEntity.point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceEntity.licenceVersionPurpose)

  const returnLog = returnLogData(
    licenceEntity.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [licenceEntity.point],
    period
  )

  returnLog.status = period.status

  return { returnRequirement, returnRequirementPoint, returnRequirementPurpose, returnLog }
}

/**
 * Generate the period details for a 'VOID' return log
 *
 * Regardless of the dates on the return log, setting the status to 'void' will make the UI display it as `VOID`.
 *
 * But we generate a return log that realistically could be voided, with the end date in the past and no due date.
 *
 * @private
 */
function _voidPeriod(currentPeriod) {
  const { startDate, endDate } = currentPeriod

  return {
    startDate,
    endDate,
    dueDate: null,
    status: 'void',
    quarterly: false
  }
}
