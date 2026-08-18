import { presrocStartDate } from '../default-values.js'
import buildLicenceEntity from '../entities/licence.entity.js'

export const title = 'Presroc licence'
export const description = 'Licence with a start date before 2022-04-01'

export default function () {
  const licenceEntity = buildLicenceEntity()

  licenceEntity.licence.startDate = presrocStartDate
  licenceEntity.licenceVersion.startDate = presrocStartDate
  licenceEntity.licenceDocument.startDate = presrocStartDate
  licenceEntity.licenceDocumentRole.startDate = presrocStartDate

  return licenceEntity
}
