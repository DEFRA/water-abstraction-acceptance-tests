import { previousPeriod } from './date.helpers.js'
import returnLogData from '../data/return-log.data.js'

/**
 * Builds the previous and current return cycle periods for a return requirement
 *
 * @param {object} cycle - the return cycle (start and end date) the return logs cover
 * @param {Date|null} [dueDate] - the due date for the previous cycle's return log
 * @param {boolean} [quarterly] - whether the return logs are for a quarterly return cycle
 *
 * @returns {object[]} The previous and current cycle periods
 */
export function returnLogPeriods(cycle, dueDate = null, quarterly = false) {
  const previousPeriodDetails = previousPeriod({
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    dueDate,
    quarterly
  })

  const currentPeriodDetails = {
    startDate: new Date(cycle.startDate),
    endDate: new Date(cycle.endDate),
    dueDate: null,
    quarterly
  }

  return [previousPeriodDetails, currentPeriodDetails]
}

/**
 * Builds a return log for a return requirement for each of the given periods
 *
 * @param {object} licence - the licence the return logs belong to
 * @param {object} returnRequirement - the return requirement the return logs are for
 * @param {object} returnRequirementPurpose - the return requirement purpose the return logs are for
 * @param {object} point - the point the return logs are for
 * @param {object[]} periods - the periods to build a return log for, for example the result of `returnLogPeriods(cycle)`
 *
 * @returns {object[]} A return log for each of the given periods
 */
export function buildReturnLogs(licence, returnRequirement, returnRequirementPurpose, point, periods) {
  return periods.map((period) => {
    return returnLogData(licence, returnRequirement, [returnRequirementPurpose], [point], period)
  })
}

/**
 * Builds a due return log for the current cycle and the previous cycle, for a single return requirement
 *
 * @param {object} licence - the licence the return logs belong to
 * @param {object} returnRequirement - the return requirement the return logs are for
 * @param {object} returnRequirementPurpose - the return requirement purpose the return logs are for
 * @param {object} point - the point the return logs are for
 * @param {object} cycle - the return cycle (start, end and due date) the return logs cover
 *
 * @returns {object[]} The due return log for the current cycle and the previous cycle
 */
export function buildPreviousAndCurrentReturnLogs(licence, returnRequirement, returnRequirementPurpose, point, cycle) {
  const currentPeriod = {
    startDate: new Date(cycle.startDate),
    endDate: new Date(cycle.endDate),
    dueDate: cycle.dueDate ? new Date(cycle.dueDate) : null,
    quarterly: false
  }
  const previousPeriodDetails = previousPeriod(currentPeriod)

  const [currentReturnLog, previousReturnLog] = buildReturnLogs(
    licence,
    returnRequirement,
    returnRequirementPurpose,
    point,
    [currentPeriod, previousPeriodDetails]
  )

  return [currentReturnLog, previousReturnLog]
}
