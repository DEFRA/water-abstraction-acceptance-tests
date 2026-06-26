import licence from "./licence";

export default function companyContact () {
  return {
    contacts: [
      {
        id: '4d6f7e8a-9b0c-4d1e-8f2a-3b4c5d6e7f80',
        department: 'Test contact',
        email: 'test.contact@example.com',
        contactType: 'department'
      }
    ],
    companyContacts: [
      {
        id: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2799',
        contactId: '4d6f7e8a-9b0c-4d1e-8f2a-3b4c5d6e7f80',
        licenceRoleId: 'c2020884-fb8b-46f1-b5a7-1d99195fc6dd',
        companyId: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2778',
        abstractionAlerts: false
      }
    ],
    events: [
     {id: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2799',
      type: 'return',
      issuer: 'acceptance-test@defra.gov.uk',
      licences: JSON.stringify(['AT/TE/ST/01/01']),
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
