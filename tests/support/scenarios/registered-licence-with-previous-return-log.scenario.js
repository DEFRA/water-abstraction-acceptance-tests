import registeredLicenceWithDueReturnLogScenario from './registered-licence-with-due-return-log.scenario.js'

export const title = 'Licence with a previous period return log'
export const description = 'Licence with a due return log set to the previous return period with no due date'

export default function (calculatedDates) {
  const registeredLicenceWithDueReturnLog = registeredLicenceWithDueReturnLogScenario(calculatedDates)

  registeredLicenceWithDueReturnLog.returnLogs[0].dueDate = null

  return registeredLicenceWithDueReturnLog
}
