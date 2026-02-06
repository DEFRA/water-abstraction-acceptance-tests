import chargeReferencesData from './charge-references.js'

export default function chargeElements (howMany = 1) {
  const { sroc: srocChargeReference } = chargeReferencesData()

  const chargeElement1 = {
    id: '0be51375-17b9-40f6-81f5-bd769ba10508',
    chargeReferenceId: srocChargeReference.id,
    abstractionPeriodStartDay: 1,
    abstractionPeriodStartMonth: 4,
    abstractionPeriodEndDay: 31,
    abstractionPeriodEndMonth: 3,
    authorisedAnnualQuantity: 16,
    section127Agreement: false,
    description: 'SROC Charge Element 140',
    purposeId: {
      schema: 'public',
      table: 'purposes',
      lookup: 'legacyId',
      value: '140',
      select: 'id'
    },
    purposePrimaryId: {
      schema: 'water',
      table: 'purposesPrimary',
      lookup: 'legacyId',
      value: 'A',
      select: 'purposePrimaryId'
    },
    purposeSecondaryId: {
      schema: 'water',
      table: 'purposesSecondary',
      lookup: 'legacyId',
      value: 'AGR',
      select: 'purposeSecondaryId'
    }
  }

  const chargeElement2 = {
    id: 'b61f0b33-0250-4f28-a58c-c369eea8be36',
    chargeReferenceId: srocChargeReference.id,
    abstractionPeriodStartDay: 1,
    abstractionPeriodStartMonth: 4,
    abstractionPeriodEndDay: 31,
    abstractionPeriodEndMonth: 3,
    authorisedAnnualQuantity: 16,
    section127Agreement: false,
    description: 'SROC Charge Element 280',
    purposeId: {
      schema: 'public',
      table: 'purposes',
      lookup: 'legacyId',
      value: '280',
      select: 'id'
    },
    purposePrimaryId: {
      schema: 'water',
      table: 'purposesPrimary',
      lookup: 'legacyId',
      value: 'A',
      select: 'purposePrimaryId'
    },
    purposeSecondaryId: {
      schema: 'water',
      table: 'purposesSecondary',
      lookup: 'legacyId',
      value: 'AGR',
      select: 'purposeSecondaryId'
    }
  }

  return {
    chargeElements: [chargeElement1, chargeElement2].slice(0, howMany)
  }
}
