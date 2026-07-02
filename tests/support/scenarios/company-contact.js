import company from '../data/company.js'
import licence from '../data/licence.js'
import companyContact from '../data/company-contact.js'
import notification from '../data/notification.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Company contact'
export const description = 'A licence, licence holder, company, a contact and notification data'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()
  const companyContactData = companyContact(companyData)

  const editCompanyContactData = companyContact(companyData, {
    department: 'Test Contact Edit Alerts',
    email: 'test.contact.edit@example.com'
  })
  const removeCompanyContactData = companyContact(companyData, {
    department: 'Test Contact Remove',
    email: 'test.contact.remove@example.com'
  })
  const restoreCompanyContactData = companyContact(companyData, {
    department: 'Test Contact Restore',
    email: 'test.contact.restore@example.com'
  })

  return mergeByKey(
    companyData,
    licence(licenceRef, companyData),
    companyContactData,
    editCompanyContactData,
    removeCompanyContactData,
    restoreCompanyContactData,
    notification(licenceRef, restoreCompanyContactData)
  )
}
