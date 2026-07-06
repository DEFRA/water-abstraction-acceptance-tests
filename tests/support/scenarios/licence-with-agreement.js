import licenceScenario from './licence.js'
import licenceAgreement from '../data/licence-agreement.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with an agreement'
export const description = 'A licence, licence holder, company and a section 127 two-part tariff agreement'

export default function () {
  const baseLicence = licenceScenario()

  return mergeByKey(baseLicence, licenceAgreement(baseLicence))
}
