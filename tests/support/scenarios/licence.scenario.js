import companyData from '../data/company.data.js'
import licenceData from '../data/licence.data.js'
import pointData from '../data/point.data.js'

export const title = 'Licence (unregistered)'
export const description = 'A licence, licence holder and a company'

export default function (licenceRef = 'AT/TE/ST/01/01') {
  const company = companyData()
  const point = pointData()
  const licence = licenceData(licenceRef, company, point)

  return {
    ...company,
    ...point,
    ...licence
  }
}
