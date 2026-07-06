import company from '../data/company.js'
import licence from '../data/licence.js'
import point from '../data/point.js'

export const title = 'Licence (unregistered)'
export const description = 'A licence, licence holder and a company'

export default function (licenceRef = 'AT/TE/ST/01/01') {
  const companyData = company()
  const pointData = point()
  const licenceData = licence(licenceRef, companyData, pointData)

  return {
    ...companyData,
    ...pointData,
    ...licenceData
  }
}
