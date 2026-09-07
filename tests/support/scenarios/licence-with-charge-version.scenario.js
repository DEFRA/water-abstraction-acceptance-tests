import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { defaultRegion } from '../default-values.js'

export const title = 'Licence with a charge version'
export const description = 'Licence with one charge version, reference and element based on the licence data'

export default function () {
  const licenceEntity = buildLicenceEntity(defaultRegion)
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    defaultRegion
  )

  return {
    ...licenceEntity,
    ...chargeVersionEntity
  }
}
