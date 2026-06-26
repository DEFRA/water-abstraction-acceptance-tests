import licenceData from '../fixture-builder/licence.js'
import notificationData from '../fixture-builder/notification.js'
import companyContactData from '../fixture-builder/company-contact.js'

export default function () {
  return {
    ...licenceData(),
    ...companyContactData(),
    ...notificationData()
  }
}
