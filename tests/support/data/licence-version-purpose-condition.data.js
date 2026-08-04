export default function (licenceVersionPurpose) {
  return {
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
}
