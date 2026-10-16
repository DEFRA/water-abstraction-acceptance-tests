import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { yesterday } from '../helpers/date.helpers.js'
import { applications, password } from '../default-values.js'
import { generateExternalEmailAddress, generateGovUKEmail } from '../helpers/generators.helpers.js'

export default function (application = applications.INTERNAL) {
  const username = application === applications.INTERNAL ? generateGovUKEmail() : generateExternalEmailAddress()

  return {
    id: generateUUID(),
    username,
    password,
    resetRequired: 0,
    application,
    badLogins: 0,
    enabled: true,
    lastLogin: yesterday()
  }
}
