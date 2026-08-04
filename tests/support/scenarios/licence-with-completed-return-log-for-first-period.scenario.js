import licenceWithOpenReturnLogForFirstPeriod from './licence-with-open-return-log-for-first-period.scenario.js'

export const title = 'Licence with completed return log (first period)'
export const description = 'Licence with a completed return log for the first return period'

export default function (calculatedDates) {
  const licence = licenceWithOpenReturnLogForFirstPeriod(calculatedDates)

  licence.returnLogs[0].status = 'completed'

  return licence
}
