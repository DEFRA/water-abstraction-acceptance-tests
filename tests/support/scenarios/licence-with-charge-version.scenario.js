import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { licenceRef as defaultLicenceRef } from '../default-values.js'

export const title = 'Licence with a charge version'
export const description = 'Licence with one charge version, reference and element based on the licence data'

export default function (licenceRef = defaultLicenceRef) {
  const licenceEntity = buildLicenceEntity(licenceRef)
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  return {
    ...licenceEntity,
    ...chargeVersionEntity
  }
}
