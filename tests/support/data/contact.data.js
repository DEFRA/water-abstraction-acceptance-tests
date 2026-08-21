import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function () {
  const contactId = generateUUID()

  return {
    id: contactId,
    department: 'Test Contact',
    email: 'test.contact@example.com',
    contactType: 'department'
  }
}
