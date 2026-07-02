import internalUser from '../data/internal-user.js'

export const title = 'Internal user only'
export const description = 'A single internal basic user with no associated licence or return data'

export default function () {
  return {
    ...internalUser()
  }
}
