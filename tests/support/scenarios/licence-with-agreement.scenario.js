import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import licenceAgreementData from 'water-abstraction-engine/cli/world/data/licence-agreement.data.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Licence with an agreement'
export const description = 'A licence, licence holder, company and a section 127 two-part tariff agreement'

export default function (region = null) {
  if (!region) {
    region = regions.ANGLIAN
  }

  const licenceEntity = buildLicenceEntity(region)
  const licenceAgreement = licenceAgreementData(licenceEntity.licence)

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    licenceAgreement,
    ...internalUserEntity
  }
}
