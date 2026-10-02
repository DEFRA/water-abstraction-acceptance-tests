import userData from '../data/user.data.js'
import userGroupData from '../data/user-group.data.js'
import { applications, groups } from '../default-values.js'

/**
 * Builds an internal user in its entirety: the user itself and the user group that gives it its permissions. The user
 * is in the super group.
 */
export default function () {
  const user = userData(applications.INTERNAL)
  const userGroup = userGroupData(user, groups.SUPER)

  return {
    user,
    userGroup
  }
}
