export default function (licenceData, { financialAgreementCode = 'S127', startDate } = {}) {
  const {
    licences: [licence]
  } = licenceData

  return {
    licenceAgreements: [
      {
        financialAgreementId: {
          schema: 'public',
          table: 'financialAgreements',
          lookup: 'code',
          value: financialAgreementCode,
          select: 'id'
        },
        licenceRef: licence.licenceRef,
        startDate: startDate ?? licence.startDate
      }
    ]
  }
}
