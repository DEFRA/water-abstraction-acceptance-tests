import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (licenceRef, contact) {
  const eventId = generateUUID()
  const notificationId = generateUUID()

  return {
    event: {
      id: eventId,
      type: 'return',
      issuer: 'acceptance-test@defra.gov.uk',
      licences: JSON.stringify([licenceRef])
    },
    notification: {
      id: notificationId,
      eventId,
      recipient: contact.email,
      messageType: 'email',
      messageRef: 'returns invitation',
      createdAt: new Date()
    }
  }
}
