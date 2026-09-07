import buildLicenceEntity from '../entities/licence.entity.js'
import { defaultRegion } from '../default-values.js'
import licenceAgreementData from '../data/licence-agreement.data.js'

export const title = 'Licence with an agreement'
export const description = 'A licence, licence holder, company and a section 127 two-part tariff agreement'

export default function () {
  const licenceEntity = buildLicenceEntity(defaultRegion)
  const licenceAgreement = licenceAgreementData(licenceEntity.licence)

  return {
    ...licenceEntity,
    licenceAgreement
  }
}
