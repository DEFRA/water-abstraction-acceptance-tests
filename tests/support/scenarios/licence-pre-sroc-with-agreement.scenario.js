import licenceAgreementData from '../data/licence-agreement.data.js'
import licencePreSrocScenario from './licence-pre-sroc.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence pre-dating the SROC scheme, with an agreement'
export const description =
  'A licence, licence holder, company and a section 127 two-part tariff agreement, pre-dating the SROC scheme so it can be used to test old charge scheme behaviour'

export default function () {
  const unregisteredLicence = licencePreSrocScenario()

  const licenceAgreement = licenceAgreementData(unregisteredLicence)

  return mergeByKey(unregisteredLicence, licenceAgreement)
}
