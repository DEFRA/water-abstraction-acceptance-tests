import returnStatusesData from './return-statuses.js'
import usersData from '../fixture-builder/users.js'

export default function() {
  return {
    users: [
      usersData().external
    ],
    ...returnStatusesData()
  }
}
