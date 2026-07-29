import licenceAgreementData from '../data/licence-agreement.data.js'
import licenceWithPreSrocChargeVersionScenario from './licence-with-pre-sroc-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Pre-SRoC Licence with an agreement'
export const description = 'A pre-Sroc licence, licence holder (company), two-part tariff agreement, and charge version'

export default function () {
  const licence = licenceWithPreSrocChargeVersionScenario()

  const licenceAgreement = licenceAgreementData(licence)

  return mergeByKey(licence, licenceAgreement)
}
