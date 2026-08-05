import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'

export const title = 'Water company licence with a charge version'
export const description =
  'Water company licence with one charge version, reference and element based on the licence data'

export default function () {
  const licenceEntity = buildLicenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  licenceEntity.licence.waterUndertaker = true

  return {
    ...licenceEntity,
    ...chargeVersionEntity
  }
}
