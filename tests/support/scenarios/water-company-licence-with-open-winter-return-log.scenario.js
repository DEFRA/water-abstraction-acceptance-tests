import licenceWithOpenWinterReturnLog from './licence-with-open-winter-return-log.scenario.js'
import { regions } from '../default-values.js'

export const title = 'Water company licence with an open return log (winter cycle)'
export const description =
  'Water company licence with one non-quarterly return requirement and an open winter return log for the previous winter cycle'

export default function (region = null) {
  if (!region) {
    region = regions.MIDLANDS
  }

  const licence = licenceWithOpenWinterReturnLog(region)

  licence.licence.waterUndertaker = true

  return licence
}
