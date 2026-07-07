import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'All return statuses'
export const description =
  'Licence with return logs covering every status: due, overdue, not yet due, completed, open, and void'

export default function () {
  const licence = unregisteredLicenceScenario()
  const returnVersion = returnVersionData(licence)

  const returnRequirementsAndLogs = _periods().map((period) => {
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
  })

  return mergeByKey(licence, returnVersion, ...returnRequirementsAndLogs)
}

/**
 * Builds the periods (and resulting status) for a set of return logs on the same licence, covering every status a
 * return log can have.
 *
 * @private
 */
function _periods() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Does the current date fall in April to December, or January to March
  const beforeNewYear = today.getMonth() + 1 > 3

  // A cycle that hasn't started yet, so it cannot be due
  const futureStartDate = beforeNewYear
    ? new Date(`${today.getFullYear() + 1}-04-01`)
    : new Date(`${today.getFullYear()}-04-01`)
  const futureEndDate = new Date(`${futureStartDate.getFullYear() + 1}-03-31`)

  // A cycle 2 years before the future one, which will have long since ended
  const previousStartDate = new Date(futureStartDate)
  previousStartDate.setFullYear(previousStartDate.getFullYear() - 2)
  const previousEndDate = new Date(futureEndDate)
  previousEndDate.setFullYear(previousEndDate.getFullYear() - 2)
  const previousDueDate = new Date(`${previousEndDate.getFullYear()}-04-28`)

  // The current cycle, which covers today
  const currentStartDate = new Date(previousStartDate)
  if (today.getMonth() + 1 !== 4) {
    currentStartDate.setFullYear(currentStartDate.getFullYear() + 1)
  }
  const currentEndDate = new Date(today)
  currentEndDate.setMonth(today.getMonth() - 1)

  const dueSoonDate = new Date(today)
  dueSoonDate.setDate(dueSoonDate.getDate() + 5)

  const overdueDate = new Date(dueSoonDate)
  overdueDate.setDate(overdueDate.getDate() - 6)

  return [
    // NOT DUE YET - the whole period is in the future so it cannot be submitted
    {
      legacyId: 9999990,
      startDate: futureStartDate,
      endDate: futureEndDate,
      dueDate: null,
      status: 'due',
      quarterly: false,
      cycleYear: currentStartDate.getFullYear()
    },
    // COMPLETE
    {
      legacyId: 9999991,
      startDate: previousStartDate,
      endDate: previousEndDate,
      dueDate: previousDueDate,
      status: 'completed',
      quarterly: false
    },
    // OPEN - past its end date with no due date set
    {
      legacyId: 9999993,
      startDate: previousStartDate,
      endDate: previousEndDate,
      dueDate: null,
      status: 'due',
      quarterly: false
    },
    // VOID - copy of OPEN but voided
    {
      legacyId: 9999992,
      startDate: previousStartDate,
      endDate: previousEndDate,
      dueDate: null,
      status: 'void',
      quarterly: false
    },
    // DUE - due date a few days in the future
    {
      legacyId: 9999994,
      startDate: currentStartDate,
      endDate: currentEndDate,
      dueDate: dueSoonDate,
      status: 'due',
      quarterly: false
    },
    // OVERDUE - due date in the past
    {
      legacyId: 9999995,
      startDate: currentStartDate,
      endDate: currentEndDate,
      dueDate: overdueDate,
      status: 'due',
      quarterly: false
    }
  ]
}
