import licenceScenario from './licence.scenario.js'
import companyContactData from '../data/company-contact.data.js'
import notificationData from '../data/notification.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Company contact'
export const description = 'A licence, licence holder, company, a contact and notification data'

export default function () {
  const licence = licenceScenario()

  const companyContact = companyContactData(licence)

  const editCompanyContact = companyContactData(licence, {
    department: 'Test Contact Edit Alerts',
    email: 'test.contact.edit@example.com'
  })
  const removeCompanyContact = companyContactData(licence, {
    department: 'Test Contact Remove',
    email: 'test.contact.remove@example.com'
  })
  const restoreCompanyContact = companyContactData(licence, {
    department: 'Test Contact Restore',
    email: 'test.contact.restore@example.com'
  })

  return mergeByKey(
    licence,
    companyContact,
    editCompanyContact,
    removeCompanyContact,
    restoreCompanyContact,
    notificationData(licence.licences[0].licenceRef, restoreCompanyContact)
  )
}
