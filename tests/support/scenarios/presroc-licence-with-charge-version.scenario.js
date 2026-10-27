import buildBillingAccountEntity from 'water-abstraction-engine/cli/world/entities/billing-account.entity.js'
import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildPresrocChargeVersionEntity from 'water-abstraction-engine/cli/world/entities/presroc-charge-version.entity.js'
import buildPresrocLicenceEntity from 'water-abstraction-engine/cli/world/entities/presroc-licence.entity.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Presroc licence with a charge version'
export const description =
  'Licence with one charge version and reference pre-dating the SRoC scheme, so it can be used to test old charge scheme behaviour'

export default function (region = null) {
  if (!region) {
    region = regions.MIDLANDS
  }

  const presrocLicenceEntity = buildPresrocLicenceEntity(region)

  const billingAccountEntity = buildBillingAccountEntity(presrocLicenceEntity, region)
  const presrocChargeVersionEntity = buildPresrocChargeVersionEntity(presrocLicenceEntity, billingAccountEntity, region)

  // Other scenarios expect the licenceAgreement in the case of 'twoPartTariff'
  // This scenario (and associated specs) add a new licence agreement as part of the test so we need to delete it here
  delete presrocChargeVersionEntity.licenceAgreement

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...presrocLicenceEntity,
    ...billingAccountEntity,
    ...presrocChargeVersionEntity,
    ...internalUserEntity
  }
}
