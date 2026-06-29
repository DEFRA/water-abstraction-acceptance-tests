export default function notification() {
  return {
    events: [
      {
        id: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2799',
        type: 'return',
        issuer: 'acceptance-test@defra.gov.uk',
        licences: JSON.stringify(['AT/TE/ST/01/01'])
      }
    ],
    notifications: [
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        eventId: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2799',
        recipient: 'test.contact@example.com',
        messageType: 'email',
        messageRef: 'returns invitation',
        createdAt: new Date()
      }
    ]
  }
}
