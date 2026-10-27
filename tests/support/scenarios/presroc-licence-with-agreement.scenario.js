import licenceAgreementData from 'water-abstraction-engine/cli/world/data/licence-agreement.data.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

import presrocLicenceScenario from './presroc-licence.scenario.js'

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
