import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'
import { regions } from '../default-values.js'

export const title = 'Licence with a two-part tariff charge version and a return log under query'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle that is under query'

export default function () {
  const region = regions.THAMES

  const licence = licenceWithTptChargeVersionAndCompletedReturnLogScenario(region)

  const {
    returnLogs: [returnLog]
  } = licence

  returnLog.underQuery = true

  return licence
}
