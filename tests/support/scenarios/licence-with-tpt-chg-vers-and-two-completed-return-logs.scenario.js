import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import pointData from '../data/point.data.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnSubmissionData from '../data/return-submission.data.js'
import licenceWithTptChgVersAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'
import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regionCode } from '../default-values.js'

export const title = 'Licence with tpt charge version and two completed return logs'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus two completed return logs for the previous winter cycle, one TPT and one not'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const previousPeriodDetails = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: null,
    quarterly: false
  })

  const currentPeriodDetails = {
    startDate: new Date(currentWinterReturnCycle.startDate),
    endDate: new Date(currentWinterReturnCycle.endDate),
    dueDate: null,
    quarterly: false
  }

  const licence = licenceWithTptChgVersAndCompletedReturnLogScenario(calculatedDates)

  // The base scenario only gives us one purpose and point (the TPT one). We add a second, non-TPT purpose and point
  // here so we have a second return requirement to hang the "not TPT" completed return log off.
  const secondPoint = pointData('Example point 2', 'TT 9876 5432')

  secondPoint.points[0].description = 'Example point 2'
  secondPoint.points[0].ngr1 = 'TT 9876 5432'
  secondPoint.points[0].externalId = `${regionCode}:9000092`

  const secondPurpose = licenceVersionPurposeData(licence, secondPoint)

  secondPurpose.licenceVersionPurposes[0].purposeId.value = '280'
  secondPurpose.licenceVersionPurposes[0].externalId = `${regionCode}:9000092`

  // Simpler to push straight onto licence.points than pull in mergeByKey just for this one array
  licence.points.push(...secondPoint.points)

  // The charge reference (built as part of licenceWithTptChgVersAndCompletedReturnLogScenario()) only accounts for the
  // first purpose's annual quantity. As it now covers both purposes' charge elements, we correct its volume to the
  // combined total.
  const {
    licenceVersionPurposes: [firstLicenceVersionPurpose]
  } = licence
  const totalAnnualQuantity =
    firstLicenceVersionPurpose.annualQuantity + secondPurpose.licenceVersionPurposes[0].annualQuantity

  licence.chargeReferences[0].volume = convertCubicMetresToMegalitres(totalAnnualQuantity)

  const secondReturnRequirement = returnRequirementData(licence, mergeByKey(secondPurpose, secondPoint))

  const previousSecondReturnLog = returnLogData(licence, secondReturnRequirement, previousPeriodDetails)
  const currentSecondReturnLog = returnLogData(licence, secondReturnRequirement, currentPeriodDetails)

  previousSecondReturnLog.returnLogs[0].status = 'completed'

  const secondReturnSubmission = returnSubmissionData(
    previousPeriodDetails,
    previousSecondReturnLog,
    secondPurpose.licenceVersionPurposes[0].annualQuantity
  )

  return mergeByKey(
    licence,
    secondPurpose,
    secondReturnRequirement,
    previousSecondReturnLog,
    currentSecondReturnLog,
    secondReturnSubmission
  )
}
