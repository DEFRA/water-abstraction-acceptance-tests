import companyContactData from '../data/company-contact.data.js'
import notificationData from '../data/notification.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Company contact'
export const description = 'A licence, licence holder, company, a contact and notification data'

export default function () {
  const unregisteredLicence = unregisteredLicenceScenario()

  const companyContact = companyContactData(unregisteredLicence)

  const editCompanyContact = companyContactData(unregisteredLicence)

  editCompanyContact.contacts[0].department = 'Test Contact Edit Alerts'
  editCompanyContact.contacts[0].email = 'test.contact.edit@example.com'

  const removeCompanyContact = companyContactData(unregisteredLicence)

  removeCompanyContact.contacts[0].department = 'Test Contact Remove'
  removeCompanyContact.contacts[0].email = 'test.contact.remove@example.com'

  const restoreCompanyContact = companyContactData(unregisteredLicence)

  restoreCompanyContact.contacts[0].department = 'Test Contact Restore'
  restoreCompanyContact.contacts[0].email = 'test.contact.restore@example.com'

  return mergeByKey(
    unregisteredLicence,
    companyContact,
    editCompanyContact,
    removeCompanyContact,
    restoreCompanyContact,
    notificationData(unregisteredLicence.licences[0].licenceRef, restoreCompanyContact)
  )
}
