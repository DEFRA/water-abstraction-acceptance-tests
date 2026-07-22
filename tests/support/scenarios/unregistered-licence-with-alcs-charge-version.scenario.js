import billingAccountData from '../data/billing-account.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with an ALCS (pre-SRoC) charge version'
export const description =
  'Unregistered licence with an ALCS charge version and charge reference, used to test setting up a new charge version that changes the licence to the current charge scheme'

export default function () {
  const unregisteredLicence = unregisteredLicenceScenario()

  const {
    companies: [company],
    licenceVersionPurposes: [licenceVersionPurpose]
  } = unregisteredLicence

  const billingAccount = billingAccountData(unregisteredLicence)
  const chargeVersion = chargeVersionData(billingAccount, unregisteredLicence)
  const chargeReference = chargeReferenceData(chargeVersion, unregisteredLicence)

  // charge-version.data.js and charge-reference.data.js build SRoC-shaped records. This scenario needs a pre-SRoC
  // (ALCS) charge version instead, which predates the chargeElements table - its purpose and abstraction period
  // fields live directly on the charge reference - so we override the generated records to match that older shape.
  const [version] = chargeVersion.chargeVersions

  version.scheme = 'alcs'
  version.versionNumber = 1
  version.startDate = '2018-01-01'
  version.companyId = company.id
  delete version.changeReasonId

  const [reference] = chargeReference.chargeReferences

  reference.description = 'Test Charge Element!'
  reference.scheme = 'alcs'
  reference.source = 'unsupported'
  reference.loss = 'medium'
  reference.season = 'all year'
  reference.seasonDerived = 'all year'
  reference.abstractionPeriodStartDay = licenceVersionPurpose.abstractionPeriodStartDay
  reference.abstractionPeriodStartMonth = licenceVersionPurpose.abstractionPeriodStartMonth
  reference.abstractionPeriodEndDay = licenceVersionPurpose.abstractionPeriodEndDay
  reference.abstractionPeriodEndMonth = licenceVersionPurpose.abstractionPeriodEndMonth
  reference.authorisedAnnualQuantity = convertCubicMetresToMegalitres(licenceVersionPurpose.annualQuantity)
  reference.purposePrimaryId = {
    schema: 'water',
    table: 'purposesPrimary',
    lookup: 'legacyId',
    value: 'A',
    select: 'purposePrimaryId'
  }
  reference.purposeSecondaryId = {
    schema: 'water',
    table: 'purposesSecondary',
    lookup: 'legacyId',
    value: 'AGR',
    select: 'purposeSecondaryId'
  }
  reference.purposeId = {
    schema: 'public',
    table: 'purposes',
    lookup: 'legacyId',
    value: '140',
    select: 'id'
  }
  reference.chargeCategoryId = null
  reference.adjustments = null
  reference.eiucRegion = null
  reference.section127Agreement = null
  delete reference.volume
  delete reference.waterModel
  delete chargeReference.chargeElements

  return mergeByKey(unregisteredLicence, billingAccount, chargeVersion, chargeReference)
}
