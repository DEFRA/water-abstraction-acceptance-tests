import buildPresrocChargeVersionEntity from '../entities/presroc-charge-version.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import licenceAgreementData from '../data/licence-agreement.data.js'
import presrocLicenceScenario from './presroc-licence.scenario.js'

export const title = 'Presroc licence with an agreement and a due return'
export const description =
  'A presroc licence with a TPT charge version, section 127 agreement and a return requirement for the 2021 to 2022 financial year with no return log ever generated against it, so it can be used to test the old charge scheme two-part tariff bill run journey'

export default function () {
  const licence = presrocLicenceScenario()

  const presrocChargeVersionEntity = buildPresrocChargeVersionEntity(
    licence.company,
    licence.address,
    licence.licence,
    licence.licenceVersionPurpose
  )

  const licenceAgreement = licenceAgreementData(licence.licence)

  const returnVersionEntity = buildReturnVersionEntity(licence.licence, licence.licenceVersionPurpose, licence.point)

  return {
    ...licence,
    ...presrocChargeVersionEntity,
    licenceAgreement,
    ...returnVersionEntity
  }
}
