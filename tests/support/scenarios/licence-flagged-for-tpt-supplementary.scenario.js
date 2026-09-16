import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import buildBillRunEntities from '../entities/bill-runs.entities.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import chargeElementData from '../data/charge-element.data.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import { markAsTwoPartTariff } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions } from '../default-values.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

const TWO_PART_TARIFF_PURPOSE_ID = '420'

export const title = 'Licence flagged for two-part tariff supplementary billing'
export const description =
  'Licence with a single charge version and charge reference, two two-part tariff charge elements, and two completed return logs matching them, plus a sent two-part tariff bill run for the same year and a licence supplementary year row flagging the licence for the next two-part tariff supplementary bill run'

export default function () {
  const region = regions.SOUTHERN

  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffPeriod]
    }
  } = calculatedDates()

  const licence = licenceWithTwoPurposesScenario(region)

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes

  // The scenario builder's second purpose defaults to 280 (Make-Up Or Top Up Water), which isn't two-part tariff. We
  // want both purposes, and so both charge elements and returns, to be two-part tariff.
  secondLicenceVersionPurpose.purposeId.value = TWO_PART_TARIFF_PURPOSE_ID

  const billingAccountEntity = buildBillingAccountEntity(licence, region)
  const chargeVersionEntity = buildChargeVersionEntity(
    {
      ...licence,
      licenceVersionPurpose: firstLicenceVersionPurpose
    },
    billingAccountEntity,
    region
  )

  const secondChargeElement = chargeElementData(chargeVersionEntity.chargeReference, secondLicenceVersionPurpose)

  const billRunEntities = buildBillRunEntities(
    licence,
    billingAccountEntity,
    chargeVersionEntity,
    twoPartTariffPeriod,
    region
  )

  markAsTwoPartTariff(billRunEntities)

  const licenceSupplementaryYear = {
    id: generateUUID(),
    licenceId: licence.licence.id,
    financialYearEnd: new Date(twoPartTariffPeriod.endDate).getUTCFullYear(),
    twoPartTariff: true
  }

  const returns = _returns(
    licence,
    twoPartTariffPeriod,
    region,
    secondLicenceVersionPurpose,
    firstLicenceVersionPurpose
  )

  return {
    ...licence,
    ...chargeVersionEntity,
    ...billingAccountEntity,
    ...mergeByKey(...billRunEntities),
    chargeElements: [chargeVersionEntity.chargeElement, secondChargeElement],
    licenceSupplementaryYears: [licenceSupplementaryYear],
    ...returns
  }
}

/**
 * Builds a return requirement, point, and purpose against a shared return version
 *
 * @private
 */
function _returnRequirement(returnVersion, licenceVersionPurpose, point) {
  const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)
  const returnRequirementPoint = returnRequirementPointData(returnRequirement, point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

  return { returnRequirement, returnRequirementPoint, returnRequirementPurpose }
}

function _returns(licence, twoPartTariffPeriod, region, secondLicenceVersionPurpose, firstLicenceVersionPurpose) {
  const [firstPoint, secondPoint] = licence.points

  const returnVersionEntity = buildReturnVersionEntity(licence)

  // In the service return logs cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return logs we're seeding.
  returnVersionEntity.returnVersion.startDate = twoPartTariffPeriod.startDate

  const [, currentPeriodDetails] = returnLogPeriods(twoPartTariffPeriod)

  const [firstReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    firstPoint,
    [currentPeriodDetails],
    region
  )

  // The return needs an actual submitted volume, not just a due return log, or the two-part tariff engine has
  // nothing to charge against and the resulting bill comes out as nil.
  firstReturnLog.status = 'completed'

  const secondReturnRequirement = _returnRequirement(
    returnVersionEntity.returnVersion,
    secondLicenceVersionPurpose,
    secondPoint
  )

  const [secondReturnLog] = buildReturnLogs(
    licence.licence,
    secondReturnRequirement.returnRequirement,
    secondReturnRequirement.returnRequirementPurpose,
    secondPoint,
    [currentPeriodDetails],
    region
  )

  secondReturnLog.status = 'completed'

  const firstReturnSubmissionEntity = buildReturnSubmissionEntity(
    firstReturnLog,
    firstLicenceVersionPurpose.annualQuantity
  )
  const secondReturnSubmissionEntity = buildReturnSubmissionEntity(
    secondReturnLog,
    secondLicenceVersionPurpose.annualQuantity
  )

  return {
    returnVersion: returnVersionEntity.returnVersion,
    returnRequirements: [returnVersionEntity.returnRequirement, secondReturnRequirement.returnRequirement],
    returnRequirementPoints: [
      returnVersionEntity.returnRequirementPoint,
      secondReturnRequirement.returnRequirementPoint
    ],
    returnRequirementPurposes: [
      returnVersionEntity.returnRequirementPurpose,
      secondReturnRequirement.returnRequirementPurpose
    ],
    returnLogs: [firstReturnLog, secondReturnLog],
    returnSubmissions: [firstReturnSubmissionEntity.returnSubmission, secondReturnSubmissionEntity.returnSubmission],
    returnSubmissionLines: [
      ...firstReturnSubmissionEntity.returnSubmissionLines,
      ...secondReturnSubmissionEntity.returnSubmissionLines
    ]
  }
}
