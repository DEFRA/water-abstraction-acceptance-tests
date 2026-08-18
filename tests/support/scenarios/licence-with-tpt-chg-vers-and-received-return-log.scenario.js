import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'

export const title = 'Licence with tpt charge version and a return log with a status of "received"'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a return log for the previous winter cycle with a status of "received"'

export default function () {
  const licence = licenceWithTptChargeVersionAndCompletedReturnLogScenario()

  const {
    returnLogs: [returnLog]
  } = licence

  returnLog.status = 'received'

  return licence
}
