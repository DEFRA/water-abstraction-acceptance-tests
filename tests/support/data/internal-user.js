export default function (username = 'regression.tests@wrls.gov.uk') {
  return {
    users: [
      {
        username,
        password: 'P@55word',
        resetRequired: 0,
        application: 'water_admin',
        badLogins: 0,
        enabled: true
      }
    ]
  }
}
