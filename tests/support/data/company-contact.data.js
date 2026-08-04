import { generateUUID } from '../helpers/generate-uuid.js'

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
