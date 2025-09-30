import licence from "../fixture-builder/licence.js"
import usersData from '../fixture-builder/users.js'

export default function() {
  return {
    users: [
      usersData().external,
      usersData().externalSharing
    ],
    ...licence()
  }
}
