import buildLicenceEntity from '../entities/licence.entity.js'
import companyContactData from '../data/company-contact.data.js'
import contactData from '../data/contact.data.js'
import { defaultRegion } from '../default-values.js'
import notificationData from '../data/notification.data.js'

export const title = 'Company contact'
export const description = 'A licence, licence holder, company, a contact and notification data'

export default function () {
  const licenceEntity = buildLicenceEntity(defaultRegion)

  const { company } = licenceEntity

  const contact = contactData(company)
  const companyContact = companyContactData(contact, licenceEntity.company)

  const editContact = contactData(company)

  const editCompanyContact = companyContactData(editContact, licenceEntity.company)

  const removeContact = contactData(company)

  const removeCompanyContact = companyContactData(removeContact, licenceEntity.company)

  const restoreContact = contactData(company)

  const restoreCompanyContact = companyContactData(restoreContact, licenceEntity.company)

  const notification = notificationData(licenceEntity.licence.licenceRef, restoreContact)

  return {
    ...licenceEntity,
    contacts: [contact, editContact, removeContact, restoreContact],
    companyContacts: [companyContact, editCompanyContact, removeCompanyContact, restoreCompanyContact],
    ...notification
  }
}
