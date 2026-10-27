import { applications } from 'water-abstraction-engine/cli/world/default-values.js'
import userData from 'water-abstraction-engine/cli/world/data/user.data.js'

export const title = 'Internal user only'
export const description = 'A single internal basic user with no associated licence or return data'

export default function () {
  const user = userData(applications.INTERNAL)

  return {
    user
  }
}
