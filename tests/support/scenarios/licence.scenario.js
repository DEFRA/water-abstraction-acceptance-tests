import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Licence only'
export const description = 'Just the licence, licence version, and licence holder (company)'

export default function (region = null) {
  if (!region) {
    region = regions.WALES
  }

  const licenceEntity = buildLicenceEntity(region)
  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    ...internalUserEntity
  }
}
