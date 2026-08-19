import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import licenceWithOpenReturnLogForFirstPeriod from './licence-with-open-return-log-for-first-period.scenario.js'

export const title = 'Licence with due return log (first period)'
export const description = 'Licence with a due return log for the first return period'

export default function () {
  const { firstReturnPeriod } = calculatedDates()

  const licence = licenceWithOpenReturnLogForFirstPeriod()

  licence.returnLogs[0].dueDate = firstReturnPeriod.dueDate

  return licence
}
