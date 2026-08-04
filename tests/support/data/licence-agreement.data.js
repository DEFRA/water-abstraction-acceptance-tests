export default function (licence) {
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
