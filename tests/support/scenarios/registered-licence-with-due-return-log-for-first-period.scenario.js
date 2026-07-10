import registeredLicenceWithOpenReturnLogForFirstPeriod from './registered-licence-with-open-return-log-for-first-period.scenario.js'

export const title = 'Registered licence with due return log (first period)'
export const description = 'Registered licence with a due return log for the first return period'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  // We load in the registered open scenario because it has 99% of the data we need
  const registeredLicence = registeredLicenceWithOpenReturnLogForFirstPeriod(calculatedDates)

  // We set the seeded return log's due date, which is what makes this 'due'
  registeredLicence.returnLogs[0].dueDate = firstReturnPeriod.dueDate

  return registeredLicence
}
