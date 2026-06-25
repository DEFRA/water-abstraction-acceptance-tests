import licenceData from '../fixture-builder/licence.js'
import companyContactData from '../fixture-builder/company-contact.js'

export default function () {
  return {
    ...licenceData(),
    ...companyContactData()
  }
}
