import licenceAgreementData from '../data/licence-agreement.data.js'
import presrocLicenceScenario from './presroc-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Presroc licence with an agreement'
export const description = 'A presroc licence, licence holder (company) and a two-part tariff agreement'

export default function () {
  const licence = presrocLicenceScenario()

  const licenceAgreement = licenceAgreementData(licence)

  return mergeByKey(licence, licenceAgreement)
}
