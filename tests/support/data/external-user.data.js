import { yesterday } from '../helpers/date.helpers.js'
import { password } from '../default-values.js'
import { generateExternalEmailAddress } from '../helpers/generators.helpers.js'

export default function () {
  return {
    username: generateExternalEmailAddress(),
    password,
    resetRequired: 0,
    application: 'water_vml',
    badLogins: 0,
    enabled: true,
    lastLogin: yesterday()
  }
}
