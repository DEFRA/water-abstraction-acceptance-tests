import company from '../data/company.js'
import licence from '../data/licence.js'

export const title = 'Licence (unregistered)'
export const description = 'A licence, with a company and licence holder'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()

  return {
    ...companyData,
    ...licence(licenceRef, companyData)
  }
}
