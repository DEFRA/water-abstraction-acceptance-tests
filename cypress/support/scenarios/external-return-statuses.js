import returnStatusesData from './return-statuses.js'
import usersData from '../fixture-builder/users.js'

export const title = 'External user viewing return statuses'
export const description =
  'All return statuses (due, overdue, void, open, not yet due, completed) visible to a registered external user'

export default function () {
  return {
    users: [usersData().external],
    ...returnStatusesData()
  }
}
