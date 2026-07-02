import { randomUUID } from 'crypto'

export default function (licenceRef, companyContactData) {
  const eventId = randomUUID()
  const notificationId = randomUUID()

  const {
    contacts: [contact]
  } = companyContactData

  return {
    events: [
      {
        id: eventId,
        type: 'return',
        issuer: 'acceptance-test@defra.gov.uk',
        licences: JSON.stringify([licenceRef])
      }
    ],
    notifications: [
      {
        id: notificationId,
        eventId,
        recipient: contact.email,
        messageType: 'email',
        messageRef: 'returns invitation',
        createdAt: new Date()
      }
    ]
  }
}
