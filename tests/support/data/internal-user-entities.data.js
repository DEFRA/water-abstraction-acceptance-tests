import usersData from './users.data.js'

/**
 * The CRM entity each internal user signs in against
 *
 * The world's reset removes them, and the legacy UI creates one on a user's first sign-in if none exists. When specs
 * sign in as the same user at the same time, each creates one, and every sign-in after that fails because it finds
 * two. Seeding them up front means sign-in only ever finds the one.
 *
 * @returns {object} the CRM entity for each internal user, keyed for the loader
 */
export default function () {
  const licenceEntities = Object.values(usersData).map((email) => {
    return { name: email, type: 'individual' }
  })

  return { licenceEntities }
}
