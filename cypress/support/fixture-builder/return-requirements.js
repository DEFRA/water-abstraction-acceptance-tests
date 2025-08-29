export default function returnRequirements (howMany = 1) {
  const returnRequirements = [
    {
      id: 'c33b9e4d-4d0f-4686-b1ac-6449ab014fd5',
      collectionFrequency: 'day',
      reportingFrequency: 'day',
      returnVersionId: 'bcd4e8c7-16ed-419c-915d-d8f184e45ed5',
      summer: false,
      upload: false,
      abstractionPeriodStartDay: 1,
      abstractionPeriodStartMonth: 1,
      abstractionPeriodEndDay: 31,
      abstractionPeriodEndMonth: 12,
      siteDescription: 'WELL POINTS AT MARS',
      legacyId: 9999990,
      externalId: '9:9999990'
    },
    {
      id: '35eb023b-0911-4876-9093-5f10406c4a2d',
      collectionFrequency: 'day',
      reportingFrequency: 'day',
      returnVersionId: 'bcd4e8c7-16ed-419c-915d-d8f184e45ed5',
      summer: true,
      upload: false,
      abstractionPeriodStartDay: 1,
      abstractionPeriodStartMonth: 1,
      abstractionPeriodEndDay: 31,
      abstractionPeriodEndMonth: 12,
      siteDescription: 'WELL POINTS AT MARS',
      legacyId: 9999991,
      externalId: '9:9999991'
    }
  ]

  const returnRequirementPurposes = [
    {
      returnRequirementId: 'c33b9e4d-4d0f-4686-b1ac-6449ab014fd5',
      externalId: '6:9999990:A:AGR:420',
      alias: 'SPRAY IRRIGATION STORAGE',
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
      }
    },
    {
      returnRequirementId: '35eb023b-0911-4876-9093-5f10406c4a2d',
      externalId: '6:9999991:A:AGR:420',
      alias: 'SPRAY IRRIGATION STORAGE',
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
      }
    }
  ]

  return {
    returnRequirements: JSON.parse(JSON.stringify(returnRequirements.slice(0, howMany))),
    returnRequirementPurposes: JSON.parse(JSON.stringify(returnRequirementPurposes.slice(0, howMany)))
  }
}
