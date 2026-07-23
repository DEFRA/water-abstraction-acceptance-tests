import billRunData from '../data/bill-run.data.js'
import licencePreSrocWithAgreementScenario from './licence-pre-sroc-with-agreement.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with an agreement and a bill run, pre-dating the SROC scheme'
export const description =
  'A licence, licence holder, company, section 127 two-part tariff agreement, and a sent two-part tariff bill run, pre-dating the SROC scheme so it can be used to test old charge scheme behaviour'

export default function () {
  const licencePreSrocAgreement = licencePreSrocWithAgreementScenario()

  const billRun = billRunData()

  return mergeByKey(licencePreSrocAgreement, billRun)
}
