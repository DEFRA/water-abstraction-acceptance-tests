import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import licenceEntity from '../entities/licence.entity.js'

export const title = 'Water company licence with a charge version'
export const description =
  'Water company licence with one charge version, reference and element based on the licence data'

export default function () {
  const licence = licenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licence.company,
    licence.address,
    licence.licence,
    licence.licenceVersionPurpose
  )

  licence.licence.waterUndertaker = true

  return {
    ...licence,
    ...chargeVersionEntity
  }
}
