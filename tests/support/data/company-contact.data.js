import { generateUUID } from '../helpers/generate-uuid.js'

export default function (companyData) {
  const contactId = generateUUID()
  const companyContactId = generateUUID()

  const {
    companies: [company]
  } = companyData

  return {
    contacts: [
      {
        id: contactId,
        department: 'Test Contact',
        email: 'test.contact@example.com',
        contactType: 'department'
      }
    ],
    companyContacts: [
      {
        id: companyContactId,
        contactId,
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
    ]
  }
}
