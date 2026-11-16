import userData from '../data/user.data.js'
import { applications } from '../default-values.js'

export const title = 'External user only'
export const description = 'A single external user with no associated licence or return data'

export default function () {
  const user = userData(applications.EXTERNAL)

  return {
    user
  }
}
