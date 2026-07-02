import { randomUUID } from 'crypto'

export default function (email, companyData) {
  const licenceEntityRoleId = randomUUID()
  const individualEntityId = randomUUID()
  const companyEntityId = randomUUID()

  const {
    companies: [company]
  } = companyData

  return {
    licenceEntities: [
      {
        id: individualEntityId,
        name: email,
        type: 'individual'
      },
      {
        id: companyEntityId,
        name: company.name,
        type: 'company'
      }
    ],
    licenceEntityRoles: [
      {
        id: licenceEntityRoleId,
        licenceEntityId: individualEntityId,
        companyEntityId,
        role: 'primary_user',
        createdBy: 'acceptance-test-setup'
      }
    ],
    users: [
      {
        username: email,
        password: 'P@55word',
        resetRequired: 0,
        application: 'water_vml',
        badLogins: 0,
        enabled: true,
        licenceEntityId: individualEntityId
      }
    ]
  }
}
