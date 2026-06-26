import licence from '../fixture-builder/licence.js'
import usersData from '../fixture-builder/users.js'

export const title = 'Sharing access'
export const description = 'Licence with two external users: a primary user and a second user with shared (agent) access'

export default function () {
  return {
    users: [
      usersData().external,
      usersData().externalSharing
    ],
    ...licence()
  }
}
