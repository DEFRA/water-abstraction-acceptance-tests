import externalUserData from '../data/external-user.data.js'
import { yesterday } from '../helpers/date.helpers.js'

export const title = 'External gov.uk user only'
export const description = 'A single external user with a gov.uk address and no associated licence or return data'

export default function () {
  const user = externalUserData()

  user.username = `regression.tests.${Date.now()}@defra.gov.uk`
  user.lastLogin = yesterday()

  return {
    user
  }
}
