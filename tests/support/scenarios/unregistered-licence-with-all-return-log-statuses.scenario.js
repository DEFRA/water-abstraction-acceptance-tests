import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { relativeToToday } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'All return log statuses'
export const description = 'Unregistered licence with returns logs covering all possible statuses'

export default function (calculatedDates) {
  const currentPeriod = _currentPeriod(calculatedDates)
  const previousPeriod = _previousPeriod(currentPeriod)

  const licence = unregisteredLicenceScenario()
  const returnVersion = returnVersionData(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.returnVersions[0].startDate = previousPeriod.startDate

  return mergeByKey(
    licence,
    returnVersion,
    _notDueYetReturnLog(licence, returnVersion, currentPeriod),
    _voidReturnLog(licence, returnVersion, currentPeriod),
    _dueReturnLog(licence, returnVersion, previousPeriod),
    _overdueReturnLog(licence, returnVersion, previousPeriod),
    _openReturnLog(licence, returnVersion, previousPeriod),
    _completedReturnLog(licence, returnVersion, previousPeriod)
  )
}

/**
 * Generate a 'COMPLETE' return log
 *
 * The end date is in the past, and the status is 'completed'. Though it won't change the status in the UI, we set the
 * 'due date' to be 29 days after the end date, to mimic the returns invitations having been sent the day after, which
 * automatically applies the 'due date' when the service confirms the notification has been successful.
 *
 * @private
 */
function _completedReturnLog(licence, returnVersion, previousPeriod) {
  const { startDate, endDate } = previousPeriod
  const dueDate = new Date(`${endDate.getFullYear()}-04-29`)

  return _returnLog(licence, returnVersion, {
    reference: 9999990,
    startDate,
    endDate,
    dueDate,
    status: 'completed',
    quarterly: false
  })
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
 * Generate a 'DUE' return log
 *
 * The end date is in the past, and the status is 'due'. Setting the 'due date' 5 days in the future makes the UI
 * display it as `DUE`.
 *
 * @private
 */
function _dueReturnLog(licence, returnVersion, previousPeriod) {
  const { startDate, endDate } = previousPeriod

  return _returnLog(licence, returnVersion, {
    reference: 9999993,
    startDate,
    endDate,
    dueDate: relativeToToday(5),
    status: 'due',
    quarterly: false
  })
}

/**
 * Generate a 'NOT DUE YET' return log
 *
 * If a return log's end date is in the future, the UI will display the status as 'NOT DUE YET'.
 *
 * @private
 */
function _notDueYetReturnLog(licence, returnVersion, currentPeriod) {
  const { startDate, endDate } = currentPeriod

  return _returnLog(licence, returnVersion, {
    reference: 9999995,
    startDate,
    endDate,
    dueDate: null,
    status: 'due',
    quarterly: false
  })
}

/**
 * Generate an 'OPEN' return log
 *
 * The end date is in the past, and the status is 'due'. Not setting the 'due date' will make the UI display it as
 * `OPEN`.
 *
 * @private
 */
function _openReturnLog(licence, returnVersion, previousPeriod) {
  const { startDate, endDate } = previousPeriod

  return _returnLog(licence, returnVersion, {
    reference: 9999991,
    startDate,
    endDate,
    dueDate: null,
    status: 'due',
    quarterly: false
  })
}

/**
 * Generate a 'OVERDUE' return log
 *
 * The end date is in the past, and the status is 'due'. Setting the 'due date' to yesterday, i.e. in the past makes the
 * UI display it as `OVERDUE`.
 *
 * @private
 */
function _overdueReturnLog(licence, returnVersion, previousPeriod) {
  const { startDate, endDate } = previousPeriod

  return _returnLog(licence, returnVersion, {
    reference: 9999992,
    startDate,
    endDate,
    dueDate: relativeToToday(-1),
    status: 'due',
    quarterly: false
  })
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
 * Builds a return requirement and return log for the given period, then applies the status and return cycle
 * overrides that can't be expressed through the shared data builders alone.
 *
 * @private
 */
function _returnLog(licence, returnVersion, period) {
  const returnRequirement = returnRequirementData(returnVersion, licence, period.reference)

  returnRequirement.returnRequirements[0].legacyId = period.reference
  returnRequirement.returnRequirements[0].reference = period.reference

  const returnLog = returnLogData(licence, returnRequirement, period)

  returnLog.returnLogs[0].status = period.status

  return mergeByKey(returnRequirement, returnLog)
}

/**
 * Generate a 'VOID' return log
 *
 * Regardless of the dates on the return log, setting the status to 'void' will make the UI display it as `VOID`.
 *
 * But we generate a return log that realistically could be voided, with the end date in the past and no due date.
 *
 * @private
 */
function _voidReturnLog(licence, returnVersion, currentPeriod) {
  const { startDate, endDate } = currentPeriod

  return _returnLog(licence, returnVersion, {
    reference: 9999994,
    startDate,
    endDate,
    dueDate: null,
    status: 'void',
    quarterly: false
  })
}
