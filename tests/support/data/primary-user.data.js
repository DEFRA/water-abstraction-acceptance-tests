import { generateUUID } from '../helpers/generate-uuid.js'

export default function (email, companyData) {
  const licenceEntityRoleId = generateUUID()
  const individualEntityId = generateUUID()
  const companyEntityId = generateUUID()

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
