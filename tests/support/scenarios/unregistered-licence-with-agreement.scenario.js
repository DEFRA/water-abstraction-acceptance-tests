import licenceAgreementData from '../data/licence-agreement.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with an agreement'
export const description = 'A licence, licence holder, company and a section 127 two-part tariff agreement'

export default function () {
  const unregisteredLicence = unregisteredLicenceScenario()

  return mergeByKey(unregisteredLicence, licenceAgreementData(unregisteredLicence))
}
