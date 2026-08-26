import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { generateExternalEmailAddress } from '../helpers/generators.helpers.js'

export default function () {
  const contactId = generateUUID()

  return {
    id: contactId,
    department: 'Test Contact',
    email: generateExternalEmailAddress(),
    contactType: 'department'
  }
}
