import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'

export const title = 'Water company licence with a charge version'
export const description =
  'Water company licence with one charge version, reference and element based on the licence data'

export default function () {
  const licence = licenceWithChargeVersionScenario()

  licence.licence.waterUndertaker = true

  return licence
}
