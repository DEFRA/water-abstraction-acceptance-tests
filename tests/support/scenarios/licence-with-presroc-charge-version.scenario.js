import billingAccountData from '../data/billing-account.data.js'
import billRunData from '../data/bill-run.data.js'
import licenceScenario from './licence.scenario.js'
import presrocChargeReferenceData from '../data/presroc-charge-reference.data.js'
import presrocChargeVersionData from '../data/presroc-charge-version.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a pre-SRoC charge version'
export const description = 'Licence with an ALCS (pre-SRoC) charge version and a sent two-part tariff bill run'

export default function () {
  const licence = licenceScenario()

  const billingAccount = billingAccountData(licence)
  const chargeVersion = presrocChargeVersionData(billingAccount, licence)
  const chargeReference = presrocChargeReferenceData(chargeVersion)

  const billRun = billRunData()

  billRun.billRuns[0].batchType = 'two_part_tariff'
  billRun.billRuns[0].fromFinancialYearEnding = '2023'
  billRun.billRuns[0].toFinancialYearEnding = '2023'

  return mergeByKey(licence, billingAccount, chargeVersion, chargeReference, billRun)
}
