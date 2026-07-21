import { yesterday } from '../helpers/date.helpers.js'
import { externalUserEmail, password } from '../default-values.js'

export default function () {
  return {
    users: [
      {
        username: externalUserEmail,
        password,
        resetRequired: 0,
        application: 'water_vml',
        badLogins: 0,
        enabled: true,
        lastLogin: yesterday()
      }
    ]
  }
}
