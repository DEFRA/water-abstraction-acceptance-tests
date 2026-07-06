import licenceScenario from './licence.js'
import companyContact from '../data/company-contact.js'
import notification from '../data/notification.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Company contact'
export const description = 'A licence, licence holder, company, a contact and notification data'

export default function () {
  const baseLicence = licenceScenario()

  const companyContactData = companyContact(baseLicence)

  const editCompanyContactData = companyContact(baseLicence, {
    department: 'Test Contact Edit Alerts',
    email: 'test.contact.edit@example.com'
  })
  const removeCompanyContactData = companyContact(baseLicence, {
    department: 'Test Contact Remove',
    email: 'test.contact.remove@example.com'
  })
  const restoreCompanyContactData = companyContact(baseLicence, {
    department: 'Test Contact Restore',
    email: 'test.contact.restore@example.com'
  })

  return mergeByKey(
    baseLicence,
    companyContactData,
    editCompanyContactData,
    removeCompanyContactData,
    restoreCompanyContactData,
    notification(baseLicence.licences[0].licenceRef, restoreCompanyContactData)
  )
}
