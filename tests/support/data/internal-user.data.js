import { internalUserEmail, password } from '../static.lib.js'

export default function () {
  return {
    users: [
      {
        username: internalUserEmail,
        password,
        resetRequired: 0,
        application: 'water_admin',
        badLogins: 0,
        enabled: true
      }
    ]
  }
}
