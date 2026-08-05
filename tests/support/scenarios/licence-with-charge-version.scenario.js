import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import licenceEntity from '../entities/licence.entity.js'

export const title = 'Licence with a charge version'
export const description = 'Licence with one charge version, reference and element based on the licence data'

export default function () {
  const licence = licenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licence.company,
    licence.address,
    licence.licence,
    licence.licenceVersionPurpose
  )

  return {
    ...licence,
    ...chargeVersionEntity
  }
}
