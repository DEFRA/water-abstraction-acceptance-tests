import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import licenceWithOpenReturnLogForFirstPeriod from './licence-with-open-return-log-for-first-period.scenario.js'
import { regions } from '../default-values.js'

export const title = 'Licence with a due return log (first period)'
export const description = 'Licence with a due return log for the first return period'

export default function (region = null) {
  if (!region) {
    region = regions.MIDLANDS
  }

  const { firstReturnPeriod } = calculatedDates()

  const licence = licenceWithOpenReturnLogForFirstPeriod(region)

  licence.returnLogs[0].dueDate = firstReturnPeriod.dueDate

  return licence
}
