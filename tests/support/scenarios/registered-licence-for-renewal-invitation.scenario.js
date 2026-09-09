import { formatDateToIso } from '../helpers/date.helpers.js'
import { regions } from '../default-values.js'
import registeredLicenceScenario from './registered-licence.scenario.js'

export const title = 'Registered licence for renewal invitation'
export const description =
  'Registered licence expiring more than 90 days ahead, making it eligible for a renewal invitation'

export default function (region = null) {
  if (!region) {
    region = regions.THAMES
  }

  const registeredLicence = registeredLicenceScenario(region)

  // The expired date needs to be more than 90 days in the future for the licence to be eligible for a renewal invitation.
  const expiredDate = new Date()

  expiredDate.setDate(expiredDate.getDate() + 91)

  registeredLicence.licence.expiredDate = formatDateToIso(expiredDate)

  return registeredLicence
}
