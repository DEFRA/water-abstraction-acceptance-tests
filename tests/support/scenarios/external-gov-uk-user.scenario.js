import { applications } from '../default-values.js'
import { generateGovUKEmail } from '../helpers/generators.helpers.js'
import userData from '../data/user.data.js'

export const title = 'External gov.uk user only'
export const description = 'A single external user with a gov.uk address and no associated licence or return data'

export default function () {
  const user = userData(applications.EXTERNAL)

  user.username = generateGovUKEmail()

  return {
    user
  }
}
