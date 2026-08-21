import { formatDateToIso } from '../helpers/date.helpers.js'
import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'

export const title = 'Licence with a two-part tariff charge version and a late return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle that was received after its due date'

export default function () {
  const licence = licenceWithTptChargeVersionAndCompletedReturnLogScenario()

  const {
    returnLogs: [returnLog]
  } = licence

  const receivedDate = new Date(returnLog.dueDate)

  receivedDate.setUTCDate(receivedDate.getUTCDate() + 3)
  returnLog.receivedDate = formatDateToIso(receivedDate)

  return licence
}
