import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { generateBillRunNumber } from '../helpers/generators.helpers.js'
import { regionCode } from '../default-values.js'

export default function () {
  return {
    id: generateUUID(),
    regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: regionCode, select: 'id' },
    batchType: 'annual',
    fromFinancialYearEnding: '2024',
    toFinancialYearEnding: '2024',
    status: 'sent',
    // In a real bill run this is returned by the Charging Module when the bill run is created there — we don't call
    // that service, so we generate our own to satisfy the column's uniqueness constraint.
    externalId: generateUUID(),
    billRunNumber: generateBillRunNumber()
  }
}
