import company from '../data/company.js'
import licence from '../data/licence.js'
import primaryUser from '../data/primary-user.js'

export const title = 'Licence for renewal invitation'
export const description = 'Licence expiring more than 90 days ahead, making it eligible for a renewal invitation'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()
  const primaryUserData = primaryUser('external@example.com', companyData)
  const licenceData = licence(licenceRef, companyData, primaryUserData)

  const {
    licences: [licenceRecord]
  } = licenceData

  // The expired date needs to be more than 90 days in the future for the licence to be eligible for a renewal invitation.
  const expiredDate = new Date()
  expiredDate.setDate(expiredDate.getDate() + 91)
  licenceRecord.expiredDate = expiredDate.toISOString().split('T')[0]

  return {
    ...companyData,
    ...primaryUserData,
    ...licenceData
  }
}
