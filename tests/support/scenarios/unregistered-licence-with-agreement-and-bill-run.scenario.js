import billRunData from '../data/bill-run.data.js'
import licenceAgreementScenario from './unregistered-licence-with-agreement.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with an agreement and a bill run'
export const description =
  'An unregistered licence, licence holder, company, section 127 two-part tariff agreement, and a sent two-part tariff bill run'

export default function () {
  const licenceAgreement = licenceAgreementScenario()

  const billRun = billRunData()

  return mergeByKey(licenceAgreement, billRun)
}
