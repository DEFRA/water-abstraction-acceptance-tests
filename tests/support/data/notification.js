import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licenceRef, companyContactData) {
  const eventId = generateUUID()
  const notificationId = generateUUID()

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
