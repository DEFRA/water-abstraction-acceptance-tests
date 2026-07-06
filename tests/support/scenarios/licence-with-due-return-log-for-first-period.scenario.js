import licenceWithReturnLogsScenario from './licence-with-return-log.scenario.js'
import { formatDateToIso } from '../helpers/date.helpers.js'

export const title = 'Licence with a due return log (first return period)'
export const description =
  'Licence with a due return log set to the first current return period, with return requirements and version'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const licenceWithReturnLogs = licenceWithReturnLogsScenario(calculatedDates)

  licenceWithReturnLogs.returnLogs[0].dueDate = formatDateToIso(new Date(firstReturnPeriod.dueDate))

  return licenceWithReturnLogs
}
