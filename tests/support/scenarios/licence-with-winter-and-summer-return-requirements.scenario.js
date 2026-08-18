import returnLogData from '../data/return-log.data.js'
import buildTwoReturnRequirementsEntity from '../entities/two-return-requirements.entity.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with winter and summer return requirements'
export const description =
  'Licence with two return requirements, a winter and a summer cycle, each with a due return log for the current ' +
  'cycle and a completed return log for the previous cycle'

export default function (calculatedDates) {
  const { currentSummerReturnCycle, currentWinterReturnCycle } = calculatedDates

  const twoReturnRequirementsEntity = buildTwoReturnRequirementsEntity()

  const [winterRequirement, summerRequirement] = twoReturnRequirementsEntity.returnRequirements
  const [winterPoint, summerPoint] = twoReturnRequirementsEntity.points
  const [winterRequirementPurpose, summerRequirementPurpose] = twoReturnRequirementsEntity.returnRequirementPurposes

  summerRequirement.summer = true

  const returnLogs = [
    ..._requirementReturnLogs(
      twoReturnRequirementsEntity.licence,
      winterRequirement,
      winterRequirementPurpose,
      winterPoint,
      currentWinterReturnCycle
    ),
    ..._requirementReturnLogs(
      twoReturnRequirementsEntity.licence,
      summerRequirement,
      summerRequirementPurpose,
      summerPoint,
      currentSummerReturnCycle
    )
  ]

  return {
    ...twoReturnRequirementsEntity,
    returnLogs
  }
}

/**
 * Builds a due return log for the current cycle and a completed return log for the previous cycle, for a single
 * return requirement
 *
 * @private
 */
function _requirementReturnLogs(licence, returnRequirement, returnRequirementPurpose, point, cycle) {
  const currentCyclePeriod = {
    startDate: new Date(cycle.startDate),
    endDate: new Date(cycle.endDate),
    dueDate: new Date(cycle.dueDate),
    quarterly: false
  }
  const previousCyclePeriod = previousPeriod(currentCyclePeriod)

  const currentReturnLog = returnLogData(
    licence,
    returnRequirement,
    [returnRequirementPurpose],
    [point],
    currentCyclePeriod
  )
  currentReturnLog.status = 'due'

  const previousReturnLog = returnLogData(
    licence,
    returnRequirement,
    [returnRequirementPurpose],
    [point],
    previousCyclePeriod
  )
  previousReturnLog.status = 'completed'

  return [currentReturnLog, previousReturnLog]
}
