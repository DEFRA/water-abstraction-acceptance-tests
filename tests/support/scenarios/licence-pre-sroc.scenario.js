import licenceScenario from './licence.scenario.js'

export const title = 'Licence pre-dating the SROC scheme'
export const description =
  'A licence, licence holder, and company, with dates overridden to safely pre-date the SROC scheme (2022-04-01), for testing old charge scheme behaviour'

export default function () {
  const licence = licenceScenario()

  // The licence's start date defaults to a recent date, but old charge scheme behaviour only applies to licences
  // that pre-date the SROC scheme (2022-04-01), so we override it here to a fixed date safely before that.
  const oldSchemeStartDate = '2018-01-01'

  licence.licences[0].startDate = oldSchemeStartDate

  licence.licenceDocuments[0].startDate = oldSchemeStartDate

  licence.licenceDocumentRoles[0].startDate = oldSchemeStartDate

  licence.licenceVersions[0].startDate = oldSchemeStartDate

  return licence
}
