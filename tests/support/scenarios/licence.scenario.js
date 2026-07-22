import companyData from '../data/company.data.js'
import licenceData from '../data/licence.data.js'
import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import pointData from '../data/point.data.js'
import { licenceRef } from '../default-values.js'

export const title = 'Licence only'
export const description = 'Just the licence, licence version, and licence holder (company)'

export default function () {
  const company = companyData()
  const point = pointData()
  const licence = licenceData(licenceRef, company)
  const licenceVersionPurpose = licenceVersionPurposeData(licence, point)

  return {
    ...company,
    ...point,
    ...licence,
    ...licenceVersionPurpose
  }
}
