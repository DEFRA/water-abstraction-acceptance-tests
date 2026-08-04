import licenceWithTptChgVersAndDueReturnLogScenario from './licence-with-tpt-chg-vers-and-due-return-log.scenario.js'
import returnSubmissionData from '../data/return-submission.data.js'
import returnSubmissionLinesData from '../data/return-submission-lines.data.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with tpt charge version and completed return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const previousPeriodDetails = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: null,
    quarterly: false
  })

  const licence = licenceWithTptChgVersAndDueReturnLogScenario(calculatedDates)

  const {
    returnLogs: [previousReturnLog]
  } = licence

  previousReturnLog.status = 'completed'

  const totalVolume = licence.licenceVersionPurpose.annualQuantity

  const returnSubmission = returnSubmissionData(previousReturnLog)
  const returnSubmissionLines = returnSubmissionLinesData(previousPeriodDetails, returnSubmission, totalVolume)

  return {
    ...licence,
    returnSubmission,
    returnSubmissionLines
  }
}
