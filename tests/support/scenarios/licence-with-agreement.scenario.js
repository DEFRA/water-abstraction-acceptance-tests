import licenceAgreementData from '../data/licence-agreement.data.js'
import licenceScenario from './licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with an agreement'
export const description = 'A licence, licence holder, company and a section 127 two-part tariff agreement'

export default function () {
  const licence = licenceScenario()

  const licenceAgreement = licenceAgreementData(licence)

  return mergeByKey(licence, licenceAgreement)
}
