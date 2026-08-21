import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { convertCubicMetresToMegalitres, splitTotalVolume } from '../helpers/conversion.helpers.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

export const title = 'Licence with a two-part tariff charge version and a return straddling two charge elements'
export const description =
  'Licence with a return version and a TPT charge version made up of one charge reference with two charge elements covering different parts of the year, plus a single completed return whose volume straddles and fully allocates to both elements'

// The first charge element covers April to October, leaving the remaining five months to the second
const FIRST_ELEMENT_MONTHS = 7

export default function () {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = buildLicenceEntity()

  const { licenceVersionPurpose, point } = licence

  const billingAccountEntity = buildBillingAccountEntity(licence.company, licence.address)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence.licence)

  const { chargeReference, chargeElements } = _chargeReference(chargeVersion, licenceVersionPurpose)

  const returnVersionEntity = buildReturnVersionEntity(licence.licence, licenceVersionPurpose, point)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousReturnLog, currentReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    point,
    periods
  )

  previousReturnLog.status = 'completed'

  // The return abstracts the licence's full authorised volume spread evenly across the year, so the seven months in
  // the first element's period allocate to it and the five months in the second element's period allocate to that,
  // filling both.
  const returnSubmissionEntity = buildReturnSubmissionEntity(previousReturnLog, licenceVersionPurpose.annualQuantity)

  return {
    ...licence,
    ...billingAccountEntity,
    chargeVersion,
    chargeReference,
    chargeElements,
    ...returnVersionEntity,
    returnLogs: [previousReturnLog, currentReturnLog],
    ...returnSubmissionEntity
  }
}

/**
 * Builds a charge reference with a charge factor, and two charge elements sharing its purpose but covering
 * different parts of the year, so a return spanning the whole year straddles and fully allocates to both
 *
 * @private
 */
function _chargeReference(chargeVersion, licenceVersionPurpose) {
  // The reference keeps a charge factor so the review page offers the "Change details" link we need to amend its
  // authorised volume.
  const chargeReference = chargeReferenceData(chargeVersion, [licenceVersionPurpose])
  chargeReference.adjustments.charge = 1.5

  // Both elements share the reference's two-part tariff purpose but cover different parts of the year (April to October
  // and November to March). The return spreads the licence's authorised volume evenly across the twelve months, so we
  // split that volume the same way and authorise each element the share of the months its period covers. That way the
  // single return straddles both and fills each exactly.
  const monthlyVolumes = splitTotalVolume(licenceVersionPurpose.annualQuantity, 12)

  const firstChargeElement = chargeElementData(chargeReference, licenceVersionPurpose)
  firstChargeElement.abstractionPeriodEndMonth = 10
  firstChargeElement.authorisedAnnualQuantity = _elementVolume(monthlyVolumes.slice(0, FIRST_ELEMENT_MONTHS))

  const secondChargeElement = chargeElementData(chargeReference, licenceVersionPurpose)
  secondChargeElement.abstractionPeriodStartMonth = 11
  secondChargeElement.authorisedAnnualQuantity = _elementVolume(monthlyVolumes.slice(FIRST_ELEMENT_MONTHS))

  return { chargeReference, chargeElements: [firstChargeElement, secondChargeElement] }
}

/**
 * Totals a run of monthly volumes and converts the result to the megalitres a charge element is authorised in.
 *
 * @private
 */
function _elementVolume(monthlyVolumes) {
  const totalVolume = monthlyVolumes.reduce((total, monthlyVolume) => {
    return total + monthlyVolume
  }, 0)

  return convertCubicMetresToMegalitres(totalVolume)
}
