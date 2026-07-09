export default function () {
  return {
    billRuns: [
      {
        regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: 9, select: 'id' },
        batchType: 'two_part_tariff',
        fromFinancialYearEnding: '2023',
        toFinancialYearEnding: '2023',
        status: 'sent'
      }
    ]
  }
}
