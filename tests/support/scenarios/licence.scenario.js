import buildLicenceEntity from '../entities/licence.entity.js'
import { twoPartTariffRegion as region } from '../default-values.js'

export const title = 'Licence only'
export const description = 'Just the licence, licence version, and licence holder (company)'

export default function () {
  return buildLicenceEntity(region)
}
