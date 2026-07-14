import externalUserData from '../data/external-user.data.js'

export const title = 'External user only'
export const description = 'A single external user with no associated licence or return data'

export default function () {
  return {
    ...externalUserData()
  }
}
