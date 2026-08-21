import licenceWithOpenReturnLogForFirstPeriod from './licence-with-open-return-log-for-first-period.scenario.js'

export const title = 'Licence with a completed return log (first period)'
export const description = 'Licence with a completed return log for the first return period'

export default function () {
  const licence = licenceWithOpenReturnLogForFirstPeriod()

  licence.returnLogs[0].status = 'completed'

  return licence
}
