import company from '../data/company.js'
import licence from '../data/licence.js'
import primaryUser from '../data/primary-user.js'

export const title = 'Licence (registered)'
export const description = 'A licence that has been registered (primary user), licence holder and a company'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()

  const primaryUserData = primaryUser('external@example.com', companyData)

  return {
    ...companyData,
    ...primaryUserData,
    ...licence(licenceRef, companyData, primaryUserData)
  }
}
