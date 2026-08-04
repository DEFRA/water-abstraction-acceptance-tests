import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'

export const title = 'Licence with tpt charge version and a nil return'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle that is a nil return'

export default function (calculatedDates) {
  const licence = licenceWithTptChargeVersionAndCompletedReturnLogScenario(calculatedDates)

  const {
    returnSubmissions: [returnSubmission]
  } = licence

  returnSubmission.nilReturn = true

  delete licence.returnSubmissionLines

  return licence
}
