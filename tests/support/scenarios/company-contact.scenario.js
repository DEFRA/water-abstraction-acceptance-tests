import buildLicenceEntity from '../entities/licence.entity.js'
import companyContactData from '../data/company-contact.data.js'
import contactData from '../data/contact.data.js'
import notificationData from '../data/notification.data.js'

export const title = 'Company contact'
export const description = 'A licence, licence holder, company, a contact and notification data'

export default function () {
  const licenceEntity = buildLicenceEntity()

  const contact = contactData()
  const companyContact = companyContactData(contact, licenceEntity.company)

  const editContact = contactData()

  editContact.department = 'Test Contact Edit Alerts'
  editContact.email = 'test.contact.edit@example.com'

  const editCompanyContact = companyContactData(editContact, licenceEntity.company)

  const removeContact = contactData()

  removeContact.department = 'Test Contact Remove'
  removeContact.email = 'test.contact.remove@example.com'

  const removeCompanyContact = companyContactData(removeContact, licenceEntity.company)

  const restoreContact = contactData()

  restoreContact.department = 'Test Contact Restore'
  restoreContact.email = 'test.contact.restore@example.com'

  const restoreCompanyContact = companyContactData(restoreContact, licenceEntity.company)

  const notification = notificationData(licenceEntity.licence.licenceRef, restoreContact)

  return {
    ...licenceEntity,
    contacts: [contact, editContact, removeContact, restoreContact],
    companyContacts: [companyContact, editCompanyContact, removeCompanyContact, restoreCompanyContact],
    ...notification
  }
}
