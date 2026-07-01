import { randomUUID } from 'crypto'

export default function (email, companiesData) {
  const licenceEntityRoleId = randomUUID()
  const individualEntityId = randomUUID()
  const companyEntityId = randomUUID()

  const company = companiesData.companies[0]

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
