import unregisteredLicenceWithOpenReturnLogForFirstPeriod from './unregistered-licence-with-open-return-log-for-first-period.scenario.js'

export const title = 'Unregistered licence with due return log (first period)'
export const description = 'Unregistered licence with a due return log for the first return period'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const unregisteredLicence = unregisteredLicenceWithOpenReturnLogForFirstPeriod(calculatedDates)

  unregisteredLicence.returnLogs[0].dueDate = firstReturnPeriod.dueDate

  return unregisteredLicence
}
