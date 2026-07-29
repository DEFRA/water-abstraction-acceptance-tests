import licenceAgreementData from '../data/licence-agreement.data.js'
import licenceWithPreSrocChargeVersionScenario from './licence-with-pre-sroc-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with an agreement and a pre-SRoC charge version'
export const description =
  'A licence, licence holder, company, section 127 two-part tariff agreement, and a charge version and reference pre-dating the SRoC scheme, so it can be used to test old charge scheme behaviour'

export default function () {
  const licence = licenceWithPreSrocChargeVersionScenario()

  const licenceAgreement = licenceAgreementData(licence)

  return mergeByKey(licence, licenceAgreement)
}
