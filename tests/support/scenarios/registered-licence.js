import company from '../data/company.js'
import licence from '../data/licence.js'
import point from '../data/point.js'
import primaryUser from '../data/primary-user.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence (registered)'
export const description = 'A licence that has been registered (primary user), licence holder and a company'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()
  const pointData = point()

  const primaryUserData = primaryUser('external@example.com', companyData)

  return mergeByKey(
    companyData,
    primaryUserData,
    pointData,
    licence(licenceRef, companyData, pointData, primaryUserData)
  )
}
