import licenceData from './licence.js'

export default function licenceAgreement () {
  const licence = licenceData().licences[0]

  return {
    financialAgreementId: {
      schema: 'public',
      table: 'financialAgreements',
      lookup: 'code',
      value: 'S127',
      select: 'id'
    },
    licenceRef: licence.licenceRef,
    startDate: licence.startDate
  }
}
