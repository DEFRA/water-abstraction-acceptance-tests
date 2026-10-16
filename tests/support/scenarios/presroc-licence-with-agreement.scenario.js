import licenceAgreementData from '../data/licence-agreement.data.js'
import presrocLicenceScenario from './presroc-licence.scenario.js'
import { regions } from '../default-values.js'

export const title = 'Presroc licence with an agreement'
export const description = 'A presroc licence, licence holder (company) and a two-part tariff agreement'

export default function (region = null) {
  if (!region) {
    region = regions.WALES
  }

  const licence = presrocLicenceScenario(region)

  const licenceAgreement = licenceAgreementData(licence.licence)

  return {
    ...licence,
    licenceAgreement
  }
}
