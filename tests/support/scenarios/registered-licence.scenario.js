import companyData from '../data/company.data.js'
import licenceData from '../data/licence.data.js'
import pointData from '../data/point.data.js'
import primaryUserData from '../data/primary-user.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence (registered)'
export const description = 'A licence that has been registered (primary user), licence holder and a company'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const company = companyData()
  const point = pointData()

  const primaryUser = primaryUserData('external@example.com', company)

  return mergeByKey(company, primaryUser, point, licenceData(licenceRef, company, point, primaryUser))
}
