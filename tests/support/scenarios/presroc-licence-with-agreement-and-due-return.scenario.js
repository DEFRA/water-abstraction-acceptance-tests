import buildBillingAccountEntity from 'water-abstraction-engine/cli/world/entities/billing-account.entity.js'
import buildPresrocChargeVersionEntity from 'water-abstraction-engine/cli/world/entities/presroc-charge-version.entity.js'
import buildReturnVersionEntity from 'water-abstraction-engine/cli/world/entities/return-version.entity.js'
import licenceAgreementData from 'water-abstraction-engine/cli/world/data/licence-agreement.data.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

import presrocLicenceScenario from './presroc-licence.scenario.js'

export const title = 'Presroc licence with an agreement and a due return'
export const description =
  'A presroc licence with a TPT charge version, section 127 agreement and a return requirement for the 2021 to 2022 financial year with no return log ever generated against it, so it can be used to test the old charge scheme two-part tariff bill run journey'

export default function () {
  const region = regions.NORTH_EAST

  const licence = presrocLicenceScenario(region)

  const billingAccountEntity = buildBillingAccountEntity(licence, region)
  const presrocChargeVersionEntity = buildPresrocChargeVersionEntity(licence, billingAccountEntity, region)
  const returnVersionEntity = buildReturnVersionEntity(licence)

  const licenceAgreement = licenceAgreementData(licence.licence)

  return {
    ...licence,
    ...billingAccountEntity,
    ...presrocChargeVersionEntity,
    licenceAgreement,
    ...returnVersionEntity
  }
}
