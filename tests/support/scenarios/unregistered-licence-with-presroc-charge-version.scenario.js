import billRunData from '../data/bill-run.data.js'
import billingAccountData from '../data/billing-account.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with a pre-SRoC charge version'
export const description =
  'Unregistered licence with an ALCS (pre-SRoC) charge version and a sent two-part tariff bill run'

export default function (licenceRef = 'AT/TE/ST/01/01') {
  const licence = unregisteredLicenceScenario(licenceRef)
  const billingAccount = billingAccountData(licence)
  const billRun = billRunData()
  const chargeVersion = chargeVersionData(licence, billingAccount)
  const chargeReference = chargeReferenceData(chargeVersion)

  return mergeByKey(licence, billingAccount, billRun, chargeVersion, chargeReference)
}
