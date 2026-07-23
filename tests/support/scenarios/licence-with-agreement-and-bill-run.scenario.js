import billRunData from '../data/bill-run.data.js'
import licenceWithAgreementScenario from './licence-with-agreement.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with an agreement and a bill run'
export const description =
  'A licence, licence holder, company, section 127 two-part tariff agreement, and a sent two-part tariff bill run.'

export default function () {
  const licenceAgreement = licenceWithAgreementScenario()

  const billRun = billRunData()

  return mergeByKey(licenceAgreement, billRun)
}
