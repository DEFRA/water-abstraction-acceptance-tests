import licenceScenario from './licence.scenario.js'

export const title = 'Presroc licence'
export const description = 'Licence with a start date before 2022-04-01'

export default function () {
  const licence = licenceScenario()

  const preSrocDate = '2018-04-01'
  licence.licences[0].startDate = preSrocDate
  licence.licenceVersions[0].startDate = preSrocDate
  licence.licenceDocuments[0].startDate = preSrocDate
  licence.licenceDocumentRoles[0].startDate = preSrocDate

  return licence
}
