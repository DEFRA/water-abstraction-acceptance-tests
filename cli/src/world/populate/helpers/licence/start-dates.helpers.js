/**
 * Start a licence on a given date
 *
 * A licence is built starting at the beginning of the previous return cycle. This moves the start of the licence, and
 * of everything that starts when it does: its permit licence, licence document, licence document role and licence
 * version.
 *
 * Call this before anything is added to the licence, as new licence versions are dated from the one before.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {string} startDate - the date the licence starts, for example '1965-04-01'
 *
 * @returns {object} the same licence entity
 */
export function startOn(licenceEntity, startDate) {
  licenceEntity.licence.startDate = startDate
  licenceEntity.permitLicence.startDate = startDate
  licenceEntity.licenceDocument.startDate = startDate
  licenceEntity.licenceDocumentRole.startDate = startDate
  licenceEntity.licenceVersion.startDate = startDate

  return licenceEntity
}
