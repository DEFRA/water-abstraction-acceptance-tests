import licenceAgreementData from '../data/licence-agreement.data.js'
import presrocLicenceWithChargeVersionScenario from './presroc-licence-with-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Pre-SRoC licence with an agreement'
export const description = 'A pre-Sroc licence, licence holder (company), two-part tariff agreement, and charge version'

export default function () {
  const licence = presrocLicenceWithChargeVersionScenario()

  const licenceAgreement = licenceAgreementData(licence)

  return mergeByKey(licence, licenceAgreement)
}
