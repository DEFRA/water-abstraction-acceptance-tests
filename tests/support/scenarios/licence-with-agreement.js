import company from '../data/company.js'
import licence from '../data/licence.js'
import licenceAgreement from '../data/licence-agreement.js'

export const title = 'Licence with an agreement'
export const description = 'A licence, licence holder, company and a section 127 two-part tariff agreement'

export default function () {
  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()
  const licenceData = licence(licenceRef, companyData)

  return {
    ...companyData,
    ...licenceData,
    ...licenceAgreement(licenceData)
  }
}
