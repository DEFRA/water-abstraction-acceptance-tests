import buildPresrocLicenceEntity from '../entities/presroc-licence.entity.js'
import { regions } from '../default-values.js'

export const title = 'Presroc licence'
export const description = 'Licence with a start date before 2022-04-01'

export default function (region = null) {
  if (!region) {
    region = regions.THAMES
  }

  const presrocLicenceEntity = buildPresrocLicenceEntity(region)

  return presrocLicenceEntity
}
