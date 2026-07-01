import licence from '../data/licence.js'
import company from '../data/company.js'
import primaryUser from '../data/primary-user.js'

export const title = 'Licence (registered)'
export const description = 'A licence, with a company and licence holder, with a primary user'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companiesData = company('Big Farm Co Ltd')

  const primaryUserData = primaryUser('external@example.com', companiesData)

  return {
    ...companiesData,
    ...primaryUserData,
    ...licence(licenceRef, companiesData, primaryUserData)
  }
}
