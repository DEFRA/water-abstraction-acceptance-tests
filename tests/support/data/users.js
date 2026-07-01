import { randomUUID } from 'crypto'

export function primaryUser(email, companies) {
  const licenceEntityRoleId = randomUUID()
  const individualEntityId = randomUUID()
  const companyEntityId = randomUUID()

  const company = companies.companies[0]

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

export const users = {
  external: 'external@example.co.uk',
  admin: 'admin-internal@wrls.gov.uk',
  basic: 'basic.access@wrls.gov.uk',
  super: 'super.user@wrls.gov.uk',
  environmentOfficer: 'environment.officer@wrls.gov.uk',
  billingAndData: 'billing.data@wrls.gov.uk',
  psc: 'permitting.support.centre@wrls.gov.uk'
}
