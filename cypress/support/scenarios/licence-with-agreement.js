import licenceData from '../fixture-builder/licence.js'

export const title = 'Licence with a section 127 agreement'
export const description =
  'Licence with an S127 two-part tariff financial agreement and a sent two-part tariff bill run'

export default function () {
  return {
    ...licenceData(),
    billRuns: [
      {
        regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: 9, select: 'id' },
        batchType: 'two_part_tariff',
        fromFinancialYearEnding: '2024',
        toFinancialYearEnding: '2024',
        status: 'sent'
      }
    ],
    licenceAgreements: [
      {
        financialAgreementId: {
          schema: 'public',
          table: 'financialAgreements',
          lookup: 'code',
          value: 'S127',
          select: 'id'
        },
        licenceRef: 'AT/TE/ST/01/01',
        startDate: '2018-01-01'
      }
    ]
  }
}
