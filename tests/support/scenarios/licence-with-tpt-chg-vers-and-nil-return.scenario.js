import returnSubmissionData from '../data/return-submission.data.js'
import licenceWithTptChgVersAndDueReturnLogScenario from './licence-with-tpt-chg-vers-and-due-return-log.scenario.js'

export const title = 'Licence with tpt charge version and a nil return'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle that is a nil return'

export default function () {
  const licence = licenceWithTptChgVersAndDueReturnLogScenario()

  const {
    returnLogs: [previousReturnLog]
  } = licence

  previousReturnLog.status = 'completed'

  const returnSubmission = returnSubmissionData(previousReturnLog)
  returnSubmission.nilReturn = true

  return {
    ...licence,
    returnSubmission
  }
}
