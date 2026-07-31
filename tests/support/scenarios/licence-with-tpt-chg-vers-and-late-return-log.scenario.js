import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'
import { formatDateToIso } from '../helpers/date.helpers.js'

export const title = 'Licence with tpt charge version and late return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle that was received after its due date'

export default function (calculatedDates) {
  const licence = licenceWithTptChargeVersionAndCompletedReturnLogScenario(calculatedDates)

  const receivedDate = new Date(licence.returnLogs[0].dueDate)

  receivedDate.setUTCDate(receivedDate.getUTCDate() + 3)
  licence.returnLogs[0].receivedDate = formatDateToIso(receivedDate)

  return licence
}
