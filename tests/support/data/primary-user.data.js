import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (email, company) {
  const licenceEntityRoleId = generateUUID()
  const individualEntityId = generateUUID()
  const companyEntityId = generateUUID()

  const individualEntity = {
    id: individualEntityId,
    name: email,
    type: 'individual'
  }

  const companyEntity = {
    id: companyEntityId,
    name: company.name,
    type: 'company'
  }

  const licenceEntityRole = {
    id: licenceEntityRoleId,
    licenceEntityId: individualEntityId,
    companyEntityId,
    role: 'primary_user',
    createdBy: 'acceptance-test-setup'
  }

  const user = {
    username: email,
    password: 'P@55word',
    resetRequired: 0,
    application: 'water_vml',
    badLogins: 0,
    enabled: true,
    licenceEntityId: individualEntityId
  }

  return {
    licenceEntities: [individualEntity, companyEntity],
    licenceEntityRole,
    user
  }
}
