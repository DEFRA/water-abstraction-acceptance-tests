import billingAccountData from '../data/billing-account.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import chargeReferenceData from '../data/charge-reference-presroc.data.js'
import licenceScenario from './licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a pre-SRoC charge version'
export const description =
  'Licence with one charge version and reference pre-dating the SRoC scheme, so it can be used to test old charge scheme behaviour'

export default function () {
  const licence = licenceScenario()

  // charge-version.data.js derives the charge version's startDate from the licence's own startDate, so we move it
  // before the start of SRoC to get a pre-SRoC charge version. We also align all the licence data to the new start date
  licence.licences[0].startDate = '2018-04-01'
  licence.licenceVersions[0].startDate = '2018-04-01'
  licence.licenceDocuments[0].startDate = '2018-04-01'
  licence.licenceDocumentRoles[0].startDate = '2018-04-01'

  const billingAccount = billingAccountData(licence)
  const chargeVersion = chargeVersionData(billingAccount, licence)

  // charge-version.data.js hardcodes the scheme to sroc, so we override it to alcs to match the pre-SRoC start date
  chargeVersion.chargeVersions[0].scheme = 'alcs'

  const chargeReference = chargeReferenceData(chargeVersion, licence)

  return mergeByKey(licence, billingAccount, chargeVersion, chargeReference)
}
