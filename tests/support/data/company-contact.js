import { randomUUID } from 'crypto'

export default function (companyData, { department = 'Test contact', email = 'test.contact@example.com' } = {}) {
  const contactId = randomUUID()
  const companyContactId = randomUUID()

  const {
    companies: [company]
  } = companyData

  return {
    contacts: [
      {
        id: contactId,
        department,
        email,
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
