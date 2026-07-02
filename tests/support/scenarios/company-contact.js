import company from '../data/company.js'
import licence from '../data/licence.js'
import companyContact from '../data/company-contact.js'
import notification from '../data/notification.js'

export const title = 'Company contact'
export const description = 'A licence, licence holder, company, a contact and notification data'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()
  const companyContactData = companyContact(companyData)

  return {
    ...companyData,
    ...licence(licenceRef, companyData),
    ...companyContactData,
    ...notification(licenceRef, companyContactData)
  }
}
