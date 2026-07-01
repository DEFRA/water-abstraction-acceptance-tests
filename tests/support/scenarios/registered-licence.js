import licence from '../data/licence.js'
import company from '../data/company.js'
import * as users from '../data/users.js'

export const title = 'Licence (registered)'
export const description = 'A licence, with a company and licence holder, with a primary user'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companies = company('Big Farm Co Ltd')

  const primaryUser = users.primaryUser('external@example.com', companies)

  return {
    ...companies,
    ...primaryUser,
    ...licence(licenceRef, companies, primaryUser)
  }
}
