import companyData from '../data/company.data.js'
import licenceData from '../data/licence.data.js'
import licenceDocumentData from '../data/licence-document.data.js'
import licenceDocumentHeaderData from '../data/licence-document-header.data.js'
import licenceDocumentRoleData from '../data/licence-document-role.data.js'
import licenceVersionData from '../data/licence-version.data.js'
import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import permitLicenceData from '../data/permit-licence.data.js'
import pointData from '../data/point.data.js'
import { determineReturnCycleStartDate, formatDateToIso, previousPeriod, today } from '../helpers/date.helpers.js'
import { licenceRef } from '../default-values.js'

export const title = 'Licence only'
export const description = 'Just the licence, licence version, and licence holder (company)'

export default function () {
  const company = companyData()
  const point = pointData()
  const licence = _licence(licenceRef, company.companies, company.addresses)
  const licenceVersionPurpose = licenceVersionPurposeData(licence.licenceVersion, point)

  return {
    ...company,
    point,
    ...licence,
    ...licenceVersionPurpose
  }
}

/**
 * Builds what a core licence looks like: the licence itself, plus its permit licence, licence document,
 * licence document header, licence document role, and licence version.
 *
 * @private
 */
function _licence(licenceRef, company, address) {
  const currentCycleStartDate = determineReturnCycleStartDate(today(), false)
  const { startDate: previousCycleStartDate } = previousPeriod({ startDate: currentCycleStartDate, quarterly: false })
  const startDate = formatDateToIso(previousCycleStartDate)

  const licence = licenceData(licenceRef, startDate)
  const permitLicence = permitLicenceData(licence)
  const licenceDocumentHeader = licenceDocumentHeaderData(licence)
  const licenceDocument = licenceDocumentData(licence)
  const licenceDocumentRole = licenceDocumentRoleData(licenceDocument, company, address)
  const licenceVersion = licenceVersionData(licence, company, address)

  return {
    permitLicence,
    licenceDocumentHeader,
    licenceDocument,
    licenceDocumentRole,
    licence,
    licenceVersion
  }
}
