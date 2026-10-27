import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildPresrocLicenceEntity from 'water-abstraction-engine/cli/world/entities/presroc-licence.entity.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Presroc licence'
export const description = 'Licence with a start date before 2022-04-01'

export default function (region = null) {
  if (!region) {
    region = regions.THAMES
  }

  const presrocLicenceEntity = buildPresrocLicenceEntity(region)

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...presrocLicenceEntity,
    ...internalUserEntity
  }
}
