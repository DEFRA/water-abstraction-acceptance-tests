import { regionCode } from '../static.lib.js'

export default function () {
  return {
    billRuns: [
      {
        regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: regionCode, select: 'id' },
        batchType: 'annual',
        fromFinancialYearEnding: '2024',
        toFinancialYearEnding: '2024',
        status: 'sent'
      }
    ]
  }
}
