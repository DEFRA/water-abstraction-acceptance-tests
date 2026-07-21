export default function (licenceData) {
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
          value: 'S127',
          select: 'id'
        },
        licenceRef: licence.licenceRef,
        startDate: licence.startDate
      }
    ]
  }
}
