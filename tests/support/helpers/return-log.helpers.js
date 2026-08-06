import returnLogData from '../data/return-log.data.js'
import { previousPeriod } from './date.helpers.js'

/**
 * Builds the previous and current cycle return logs for a return requirement
 *
 * @param {object} licence - the licence the return logs belong to
 * @param {object} returnRequirement - the return requirement the return logs are for
 * @param {object} returnRequirementPurpose - the return requirement purpose the return logs are for
 * @param {object} point - the point the return logs are for
 * @param {object} cycle - the return cycle (start and end date) the return logs cover
 * @param {Date|null} [dueDate] - the due date for the previous cycle's return log
 * @param {boolean} [quarterly] - whether the return logs are for a quarterly return cycle
 *
 * @returns {object[]} The previous and current cycle return logs
 */
export function buildReturnLogs(
  licence,
  returnRequirement,
  returnRequirementPurpose,
  point,
  cycle,
  dueDate = null,
  quarterly = false
) {
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

  const previousReturnLog = returnLogData(
    licence,
    returnRequirement,
    [returnRequirementPurpose],
    [point],
    previousPeriodDetails
  )
  const currentReturnLog = returnLogData(
    licence,
    returnRequirement,
    [returnRequirementPurpose],
    [point],
    currentPeriodDetails
  )

  return [previousReturnLog, currentReturnLog]
}
