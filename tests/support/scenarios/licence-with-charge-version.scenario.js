import buildBillingAccountEntity from 'water-abstraction-engine/cli/world/entities/billing-account.entity.js'
import buildChargeVersionEntity from 'water-abstraction-engine/cli/world/entities/charge-version.entity.js'
import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Licence with a charge version'
export const description = 'Licence with one charge version, reference and element based on the licence data'

export default function (region = null) {
  if (!region) {
    region = regions.ANGLIAN
  }

  const licenceEntity = buildLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...internalUserEntity
  }
}
