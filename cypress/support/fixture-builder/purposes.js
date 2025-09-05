export default function purposes (howMany = 1) {
  const licenceVersionPurposes = [
    {
      id: 'f264184b-22a7-4e26-bd90-d5738eb2e07e',
      licenceVersionId: '7ac6be4b-b7a0-4e35-9cd4-bd1c783af32b',
      primaryPurposeId: {
        schema: 'water',
        table: 'purposesPrimary',
        lookup: 'legacyId',
        value: 'A',
        select: 'purposePrimaryId'
      },
      secondaryPurposeId: {
        schema: 'water',
        table: 'purposesSecondary',
        lookup: 'legacyId',
        value: 'AGR',
        select: 'purposeSecondaryId'
      },
      purposeId: {
        schema: 'public',
        table: 'purposes',
        lookup: 'legacyId',
        value: '140',
        select: 'id'
      },
      abstractionPeriodStartDay: 1,
      abstractionPeriodStartMonth: 4,
      abstractionPeriodEndDay: 31,
      abstractionPeriodEndMonth: 3,
      annualQuantity: 1554,
      externalId: '6:1234'
    },
    {
      id: 'fb82d30d-49e5-4295-96f9-03abf126cbd7',
      licenceVersionId: '7ac6be4b-b7a0-4e35-9cd4-bd1c783af32b',
      primaryPurposeId: {
        schema: 'water',
        table: 'purposesPrimary',
        lookup: 'legacyId',
        value: 'P',
        select: 'purposePrimaryId'
      },
      secondaryPurposeId: {
        schema: 'water',
        table: 'purposesSecondary',
        lookup: 'legacyId',
        value: 'CHE',
        select: 'purposeSecondaryId'
      },
      purposeId: {
        schema: 'public',
        table: 'purposes',
        lookup: 'legacyId',
        value: '270',
        select: 'id'
      },
      abstractionPeriodStartDay: 1,
      abstractionPeriodStartMonth: 4,
      abstractionPeriodEndDay: 31,
      abstractionPeriodEndMonth: 3,
      annualQuantity: 1554,
      externalId: '6:1235'
    }
  ]

  const licenceVersionPurposePoints = [
    {
      licenceVersionPurposeId: 'f264184b-22a7-4e26-bd90-d5738eb2e07e',
      pointId: '1cb602f8-6a01-4435-96b0-541e03f460da'
    },
    {
      licenceVersionPurposeId: 'fb82d30d-49e5-4295-96f9-03abf126cbd7',
      pointId: '82fab927-ef31-45a2-a4e6-104315cb9764'
    }
  ]

  return {
    licenceVersionPurposes: licenceVersionPurposes.slice(0, howMany),
    licenceVersionPurposePoints: licenceVersionPurposePoints.slice(0, howMany)
  }
}
