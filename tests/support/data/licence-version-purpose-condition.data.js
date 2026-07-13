export default function (licenceVersionPurposeData) {
  const {
    licenceVersionPurposes: [licenceVersionPurpose]
  } = licenceVersionPurposeData

  return {
    licenceVersionPurposeConditions: [
      {
        licenceVersionPurposeId: licenceVersionPurpose.id,
        licenceVersionPurposeConditionTypeId: {
          schema: 'public',
          table: 'licenceVersionPurposeConditionTypes',
          lookup: 'subcode',
          value: 'LEV',
          select: 'id'
        },
        notes: 'Test condition notes'
      }
    ]
  }
}
