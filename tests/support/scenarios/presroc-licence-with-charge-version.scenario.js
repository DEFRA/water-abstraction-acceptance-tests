import buildPresrocChargeVersionEntity from '../entities/presroc-charge-version.entity.js'
import presrocLicenceScenario from './presroc-licence.scenario.js'
import { regions } from '../default-values.js'

export const title = 'Presroc licence with a charge version'
export const description =
  'Licence with one charge version and reference pre-dating the SRoC scheme, so it can be used to test old charge scheme behaviour'

export default function (region = null) {
  if (!region) {
    region = regions.MIDLANDS
  }

  const licence = presrocLicenceScenario(region)

  const presrocChargeVersionEntity = buildPresrocChargeVersionEntity(
    licence.company,
    licence.address,
    licence.licence,
    licence.licenceVersionPurpose,
    region
  )

  return {
    ...licence,
    ...presrocChargeVersionEntity
  }
}
