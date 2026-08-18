import returnLogData from '../data/return-log.data.js'
import buildTwoReturnRequirementsEntity from '../entities/two-return-requirements.entity.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with two return requirements and historic return logs'
export const description =
  'Licence with two return requirements, each tied to its own abstraction point, and each with a due return log ' +
  'for the current cycle plus a completed return log for the previous cycle'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const twoReturnRequirementsEntity = buildTwoReturnRequirementsEntity()

  const [firstRequirement, secondRequirement] = twoReturnRequirementsEntity.returnRequirements
  const [firstPoint, secondPoint] = twoReturnRequirementsEntity.points
  const [firstRequirementPurpose, secondRequirementPurpose] = twoReturnRequirementsEntity.returnRequirementPurposes

  const returnLogs = [
    ..._requirementReturnLogs(
      twoReturnRequirementsEntity.licence,
      firstRequirement,
      firstRequirementPurpose,
      firstPoint,
      currentWinterReturnCycle
    ),
    ..._requirementReturnLogs(
      twoReturnRequirementsEntity.licence,
      secondRequirement,
      secondRequirementPurpose,
      secondPoint,
      currentWinterReturnCycle
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
  const currentPeriod = {
    startDate: new Date(cycle.startDate),
    endDate: new Date(cycle.endDate),
    dueDate: new Date(cycle.dueDate),
    quarterly: false
  }
  const previousPeriodDetails = previousPeriod(currentPeriod)

  const currentReturnLog = returnLogData(licence, returnRequirement, [returnRequirementPurpose], [point], currentPeriod)
  currentReturnLog.status = 'due'

  const previousReturnLog = returnLogData(
    licence,
    returnRequirement,
    [returnRequirementPurpose],
    [point],
    previousPeriodDetails
  )
  previousReturnLog.status = 'completed'

  return [currentReturnLog, previousReturnLog]
}
