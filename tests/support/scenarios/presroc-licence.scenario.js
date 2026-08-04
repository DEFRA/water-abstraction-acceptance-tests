import licenceScenario from './licence.scenario.js'

export const title = 'Presroc licence'
export const description = 'Licence with a start date before 2022-04-01'

export default function () {
  const licence = licenceScenario()

  const preSrocDate = '2018-04-01'

  licence.licence.startDate = preSrocDate
  licence.licenceVersion.startDate = preSrocDate
  licence.licenceDocument.startDate = preSrocDate
  licence.licenceDocumentRole.startDate = preSrocDate

  return licence
}
