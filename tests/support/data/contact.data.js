import { generateUUID } from '../helpers/generate-uuid.js'

export default function () {
  const contactId = generateUUID()

  return {
    id: contactId,
    department: 'Test Contact',
    email: 'test.contact@example.com',
    contactType: 'department'
  }
}
