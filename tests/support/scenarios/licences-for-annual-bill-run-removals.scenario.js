import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions } from '../default-values.js'

export const title = 'Licences for annual bill run removals'
export const description =
  'Two licences, each with its own billing account, and two licences sharing one billing account, all in one region, to allow testing of removing a bill and a licence from a bill run'

export default function () {
  const region = regions.WALES

  const firstLicence = _licenceWithOwnBillingAccount(region)
  const secondLicence = _licenceWithOwnBillingAccount(region)
  const thirdLicence = _licenceWithOwnBillingAccount(region)
  const fourthLicence = _licenceSharingBillingAccount(thirdLicence, region)

  return mergeByKey(firstLicence, secondLicence, thirdLicence, fourthLicence)
}

function _licenceWithOwnBillingAccount(region) {
  const licenceEntity = buildLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)

  return { ...licenceEntity, ...billingAccountEntity, ...chargeVersionEntity }
}

/**
 * Builds a licence billed to another licence's billing account and held by the same company, so both end up on one
 * bill
 *
 * @private
 */
function _licenceSharingBillingAccount(sharedLicence, region) {
  const licenceEntity = buildLicenceEntity(region)

  // A shared billing account implies a shared licence holder, so this licence's own company isn't seeded
  delete licenceEntity.company
  delete licenceEntity.companyAddress

  licenceEntity.licenceDocumentRole.companyId = sharedLicence.company.id
  licenceEntity.licenceVersion.companyId = sharedLicence.company.id

  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, sharedLicence, region)

  return { ...licenceEntity, ...chargeVersionEntity }
}
