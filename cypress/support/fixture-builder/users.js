export default function () {
  return {
    external: {
      username: 'external@example.com',
      password: 'P@55word',
      resetRequired: 0,
      application: 'water_vml',
      badLogins: 0,
      enabled: true
    },
    externalSharing: {
      username: 'external.shared@example.com',
      password: 'P@55word',
      resetRequired: 0,
      application: 'water_vml',
      badLogins: 0,
      enabled: true
    },
    internalBasicUser: {
      username: 'basic.user@example.com',
      password: 'P@55word',
      resetRequired: 0,
      application: 'water_admin',
      badLogins: 0,
      enabled: true
    }
  }
}
