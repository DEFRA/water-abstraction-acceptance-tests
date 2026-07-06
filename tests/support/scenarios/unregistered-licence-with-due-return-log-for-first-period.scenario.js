import unregisteredLicenceWithReturnLogsScenario from './unregistered-licence-with-return-log.scenario.js'
import { formatDateToIso } from '../helpers/date.helpers.js'

export const title = 'Unregistered Licence with a due return log (first return period)'
export const description =
  'Unregistered licence with a due return log set to the first current return period, with return requirements and version'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const unregisteredLicenceWithReturnLogs = unregisteredLicenceWithReturnLogsScenario(calculatedDates)

  unregisteredLicenceWithReturnLogs.returnLogs[0].dueDate = formatDateToIso(new Date(firstReturnPeriod.dueDate))

  return unregisteredLicenceWithReturnLogs
}
