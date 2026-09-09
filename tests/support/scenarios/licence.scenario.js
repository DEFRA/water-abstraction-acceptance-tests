import buildLicenceEntity from '../entities/licence.entity.js'
import { regions } from '../default-values.js'

export const title = 'Licence only'
export const description = 'Just the licence, licence version, and licence holder (company)'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  return buildLicenceEntity(region)
}
