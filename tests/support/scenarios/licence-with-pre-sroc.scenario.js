import licenceScenario from './licence.scenario.js'

export const title = 'Licence for pre-SRoC'
export const description = 'Licence for pre-SRoC '

export default function () {
  const licence = licenceScenario()

  const preSrocDate = '2018-04-01'
  licence.licences[0].startDate = preSrocDate
  licence.licenceVersions[0].startDate = preSrocDate
  licence.licenceDocuments[0].startDate = preSrocDate
  licence.licenceDocumentRoles[0].startDate = preSrocDate

  return licence
}
