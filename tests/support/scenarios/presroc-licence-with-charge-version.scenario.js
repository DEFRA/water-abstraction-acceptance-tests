import buildPresrocChargeVersionEntity from '../entities/presroc-charge-version.entity.js'
import presrocLicenceScenario from './presroc-licence.scenario.js'

export const title = 'Presroc licence with a charge version'
export const description =
  'Licence with one charge version and reference pre-dating the SRoC scheme, so it can be used to test old charge scheme behaviour'

export default function () {
  const licence = presrocLicenceScenario()

  const presrocChargeVersionEntity = buildPresrocChargeVersionEntity(
    licence.company,
    licence.address,
    licence.licence,
    licence.licenceVersionPurpose
  )

  return {
    ...licence,
    ...presrocChargeVersionEntity
  }
}
