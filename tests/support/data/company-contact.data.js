import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (contact, company) {
  const companyContactId = generateUUID()

  return {
    id: companyContactId,
    contactId: contact.id,
    licenceRoleId: {
      schema: 'public',
      table: 'licenceRoles',
      lookup: 'name',
      value: 'additionalContact',
      select: 'id'
    },
    companyId: company.id,
    abstractionAlerts: false
  }
}
