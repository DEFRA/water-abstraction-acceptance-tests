import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'

export const title = 'Licence with tpt charge version and an aggregate value'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle, and a charge reference with an aggregate value'

export default function () {
  const licence = licenceWithTptChargeVersionAndCompletedReturnLogScenario()

  licence.chargeReference.adjustments.aggregate = '0.5'

  return licence
}
