import licenceData from '../fixture-builder/licence.js'
import notificationData from '../fixture-builder/notification.js'
import companyContactData from '../fixture-builder/company-contact.js'

export const title = 'Company contact'
export const description = 'Licence with a company contact and notification data'

export default function () {
  return {
    ...licenceData(),
    ...companyContactData(),
    ...notificationData()
  }
}
