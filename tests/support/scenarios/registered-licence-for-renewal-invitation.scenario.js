import registeredLicenceScenario from './registered-licence.scenario.js'
import { formatDateToIso } from '../helpers/date.helpers.js'

export const title = 'Registered licence for renewal invitation'
export const description =
  'Registered licence expiring more than 90 days ahead, making it eligible for a renewal invitation'

export default function () {
  const registeredLicence = registeredLicenceScenario()

  const {
    licences: [licence]
  } = registeredLicence

  // The expired date needs to be more than 90 days in the future for the licence to be eligible for a renewal invitation.
  const expiredDate = new Date()

  expiredDate.setDate(expiredDate.getDate() + 91)

  licence.expiredDate = formatDateToIso(expiredDate)

  return registeredLicence
}
