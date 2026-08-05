import licenceAgreementData from '../data/licence-agreement.data.js'
import licenceEntity from '../entities/licence.entity.js'

export const title = 'Licence with an agreement'
export const description = 'A licence, licence holder, company and a section 127 two-part tariff agreement'

export default function () {
  const licence = licenceEntity()
  const licenceAgreement = licenceAgreementData(licence.licence)

  return {
    ...licence,
    licenceAgreement
  }
}
