import { randomUUID } from 'crypto'

export default function (companyData, { department = 'Test contact', email = 'test.contact@example.com' } = {}) {
  const contactId = randomUUID()
  const companyContactId = randomUUID()

  // This is a fixed id for the additional contact role, this is seeded by the database
  const additionalContactId = 'c2020884-fb8b-46f1-b5a7-1d99195fc6dd'

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
        licenceRoleId: additionalContactId,
        companyId: company.id,
        abstractionAlerts: false
      }
    ]
  }
}
