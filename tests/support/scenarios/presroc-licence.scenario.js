import buildLicenceEntity from '../entities/licence.entity.js'

export const title = 'Presroc licence'
export const description = 'Licence with a start date before 2022-04-01'

export default function () {
  const licenceEntity = buildLicenceEntity()

  const preSrocDate = '2018-04-01'

  licenceEntity.licence.startDate = preSrocDate
  licenceEntity.licenceVersion.startDate = preSrocDate
  licenceEntity.licenceDocument.startDate = preSrocDate
  licenceEntity.licenceDocumentRole.startDate = preSrocDate

  return licenceEntity
}
