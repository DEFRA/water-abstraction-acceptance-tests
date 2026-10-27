import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

import licenceWithOpenReturnLogForFirstPeriod from './licence-with-open-return-log-for-first-period.scenario.js'

export const title = 'Licence with a completed return log (first period)'
export const description = 'Licence with a completed return log for the first return period'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  const licence = licenceWithOpenReturnLogForFirstPeriod(region)

  licence.returnLogs[0].status = 'completed'

  return licence
}
