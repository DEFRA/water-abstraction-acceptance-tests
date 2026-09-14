import buildLicenceEntity from './licence.entity.js'
import { previousYears } from '../helpers/date.helpers.js'
import { srocStartDate } from '../default-values.js'

/**
 * Builds a pre sroc licence in its entirety: the licence itself, its licence holder (company and address), permit licence,
 * licence document, licence document header, licence document role, licence version, and a licence version purpose
 * and point — the minimum valid data a licence needs to exist.
 *
 * @param {object} region - the region
 */
export default function (region) {
  const licenceEntity = buildLicenceEntity(region)

  const presrocStartDate = previousYears(srocStartDate, 1)

  licenceEntity.licence.startDate = presrocStartDate
  licenceEntity.licenceVersion.startDate = presrocStartDate
  licenceEntity.licenceDocument.startDate = presrocStartDate
  licenceEntity.licenceDocumentRole.startDate = presrocStartDate

  return licenceEntity
}
