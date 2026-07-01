import licence from '../data/licence.js'
import company from '../data/company.js'

export const title = 'Licence (unregistered)'
export const description = 'A licence, with a company and licence holder'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companies = company('Big Farm Co Ltd')

  return {
    ...companies,
    ...licence(licenceRef, companies)
  }
}
