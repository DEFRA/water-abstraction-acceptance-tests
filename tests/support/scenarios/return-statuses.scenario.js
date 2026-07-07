import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { relativeToToday, today } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'All return statuses'
export const description =
  'Licence with return logs covering every status: due, overdue, not yet due, completed, open, and void'

export default function () {
  const licence = unregisteredLicenceScenario()
  const returnVersion = returnVersionData(licence)

  return mergeByKey(
    licence,
    returnVersion,
    _notDueYetReturnLog(licence, returnVersion),
    _completedReturnLog(licence, returnVersion),
    _openReturnLog(licence, returnVersion),
    _voidReturnLog(licence, returnVersion),
    _dueReturnLog(licence, returnVersion),
    _overdueReturnLog(licence, returnVersion)
  )
}

function _completedReturnLog(licence, returnVersion) {
  const { startDate, endDate } = _previousPeriod()
  const dueDate = new Date(`${endDate.getFullYear()}-04-28`)

  return _returnLog(licence, returnVersion, {
    legacyId: 9999991,
    startDate,
    endDate,
    dueDate,
    status: 'completed',
    quarterly: false
  })
}

// The cycle that covers today
function _currentPeriod() {
  const now = today()
  const previousPeriod = _previousPeriod()

  const startDate = new Date(previousPeriod.startDate)
  if (now.getMonth() + 1 !== 4) {
    startDate.setFullYear(startDate.getFullYear() + 1)
  }
  const endDate = new Date(now)
  endDate.setMonth(now.getMonth() - 1)

  return { startDate, endDate }
}

// Due date a few days in the future
function _dueReturnLog(licence, returnVersion) {
  const { startDate, endDate } = _currentPeriod()

  return _returnLog(licence, returnVersion, {
    legacyId: 9999994,
    startDate,
    endDate,
    dueDate: relativeToToday(5),
    status: 'due',
    quarterly: false
  })
}

// A cycle that hasn't started yet
function _futurePeriod() {
  const now = today()

  // Does the current date fall in April to December, or January to March
  const beforeNewYear = now.getMonth() + 1 > 3

  const startDate = beforeNewYear ? new Date(`${now.getFullYear() + 1}-04-01`) : new Date(`${now.getFullYear()}-04-01`)
  const endDate = new Date(`${startDate.getFullYear() + 1}-03-31`)

  return { startDate, endDate }
}

// The whole period is in the future so it cannot yet be submitted
function _notDueYetReturnLog(licence, returnVersion) {
  const { startDate, endDate } = _futurePeriod()
  const { startDate: cycleStartDate } = _currentPeriod()

  return _returnLog(licence, returnVersion, {
    legacyId: 9999990,
    startDate,
    endDate,
    dueDate: null,
    status: 'due',
    quarterly: false,
    cycleYear: cycleStartDate.getFullYear()
  })
}

// Past its end date with no due date set
function _openReturnLog(licence, returnVersion) {
  const { startDate, endDate } = _previousPeriod()

  return _returnLog(licence, returnVersion, {
    legacyId: 9999993,
    startDate,
    endDate,
    dueDate: null,
    status: 'due',
    quarterly: false
  })
}

// Same period as DUE, but the due date is in the past
function _overdueReturnLog(licence, returnVersion) {
  const { startDate, endDate } = _currentPeriod()

  return _returnLog(licence, returnVersion, {
    legacyId: 9999995,
    startDate,
    endDate,
    dueDate: relativeToToday(-1),
    status: 'due',
    quarterly: false
  })
}

// A cycle 2 years before the future one, which will have long since ended
function _previousPeriod() {
  const futurePeriod = _futurePeriod()

  const startDate = new Date(futurePeriod.startDate)
  startDate.setFullYear(startDate.getFullYear() - 2)
  const endDate = new Date(futurePeriod.endDate)
  endDate.setFullYear(endDate.getFullYear() - 2)

  return { startDate, endDate }
}

/**
 * Builds a return requirement and return log for the given period, then applies the status and return cycle
 * overrides that can't be expressed through the shared data builders alone.
 *
 * @private
 */
function _returnLog(licence, returnVersion, period) {
  const returnRequirement = returnRequirementData(returnVersion, licence, period.legacyId)
  const returnLog = returnLogData(licence, returnRequirement, period)

  returnLog.returnLogs[0].status = period.status

  // The return cycle lookup only has rows for cycles that have already started, so a return log with a start
  // date in the future has to be pointed at an existing (real) cycle instead - it's an FK requirement only; the
  // status shown to the user is derived from the return log's own start, end and due dates, not this lookup
  if (period.cycleYear) {
    returnLog.returnLogs[0].returnCycleId.value = `${period.cycleYear}-04-01`
  }

  return mergeByKey(returnRequirement, returnLog)
}

// Same period as OPEN, but voided
function _voidReturnLog(licence, returnVersion) {
  const { startDate, endDate } = _previousPeriod()

  return _returnLog(licence, returnVersion, {
    legacyId: 9999992,
    startDate,
    endDate,
    dueDate: null,
    status: 'void',
    quarterly: false
  })
}
