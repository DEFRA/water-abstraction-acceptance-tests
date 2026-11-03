import { generateCompanyContact, generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (company) {
  const contactId = generateUUID()

  const { department, email } = generateCompanyContact(company.name)

  return {
    id: contactId,
    department,
    email,
    contactType: 'department'
  }
}
