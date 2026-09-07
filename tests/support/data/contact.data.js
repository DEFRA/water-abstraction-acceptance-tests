import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { generateCompanyContact } from '../helpers/generators.helpers.js'

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
