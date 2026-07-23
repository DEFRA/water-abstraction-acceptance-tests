import billingAccountData from '../data/billing-account.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import licenceScenario from './licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a charge version'
export const description = 'Licence with one charge version, reference and element based on the licence data'

export default function () {
  const licence = licenceScenario()

  // charge-version.data.js derives the charge version's startDate and scheme from the licence's own startDate, so we
  // move it to the start of SRoC to get an SRoC charge version
  licence.licences[0].startDate = '2022-04-01'

  const billingAccount = billingAccountData(licence)
  const chargeVersion = chargeVersionData(billingAccount, licence)
  const chargeReference = chargeReferenceData(chargeVersion, licence)

  return mergeByKey(licence, billingAccount, chargeVersion, chargeReference)
}
