import internalUserData from '../data/internal-user.data.js'

export const title = 'Internal user only'
export const description = 'A single internal basic user with no associated licence or return data'

export default function () {
  return {
    ...internalUserData()
  }
}
