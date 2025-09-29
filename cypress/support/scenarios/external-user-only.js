import usersData from '../fixture-builder/users.js'

export default function() {
  return {
    users: [
      usersData().external
    ]
  }
}
