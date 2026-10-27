import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import companyContactData from 'water-abstraction-engine/cli/world/data/company-contact.data.js'
import contactData from 'water-abstraction-engine/cli/world/data/contact.data.js'
import notificationData from 'water-abstraction-engine/cli/world/data/notification.data.js'
import { groups, regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Company contact'
export const description = 'A licence, licence holder, company, a contact and notification data'

export default function (region = null) {
  if (!region) {
    region = regions.NORTH_WEST
  }

  const licenceEntity = buildLicenceEntity(region)

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

  const internalUserEntity = buildInternalUserEntity(groups.ENVIRONMENT_OFFICER)

  return {
    ...licenceEntity,
    contacts: [contact, editContact, removeContact, restoreContact],
    companyContacts: [companyContact, editCompanyContact, removeCompanyContact, restoreCompanyContact],
    ...notification,
    ...internalUserEntity
  }
}
