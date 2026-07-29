import licenceScenario from './licence.scenario.js'

export const title = 'Licence with a pre-SRoC charge version'
export const description =
  'Licence with one charge version and reference pre-dating the SRoC scheme, so it can be used to test old charge scheme behaviour'

export default function () {
  const licence = licenceScenario()

  const preSrocDate = '2018-04-01'
  licence.licences[0].startDate = preSrocDate
  licence.licenceVersions[0].startDate = preSrocDate
  licence.licenceDocuments[0].startDate = preSrocDate
  licence.licenceDocumentRoles[0].startDate = preSrocDate

  return licence
}
