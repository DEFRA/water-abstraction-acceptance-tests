import { generateGovUKEmail } from '../helpers/generators.helpers.js'
import { password } from '../default-values.js'
import { yesterday } from '../helpers/date.helpers.js'

export default function () {
  return {
    username: generateGovUKEmail(),
    password,
    resetRequired: 0,
    application: 'water_admin',
    badLogins: 0,
    enabled: true,
    lastLogin: yesterday()
  }
}
