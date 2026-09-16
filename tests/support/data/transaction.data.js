import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { chargeYearAmount } from '../helpers/billing.helpers.js'

export default function (billLicence, chargeReference, dates) {
  const netAmount = chargeYearAmount(dates.endDate.getUTCFullYear(), chargeReference.section127Agreement)

  return {
    id: generateUUID(),
    billLicenceId: billLicence.id,
    chargeReferenceId: chargeReference.id,
    chargeType: 'standard',
    startDate: dates.startDate,
    endDate: dates.endDate,
    source: chargeReference.source,
    loss: chargeReference.loss,
    volume: chargeReference.volume,
    scheme: chargeReference.scheme,
    section127Agreement: chargeReference.section127Agreement,
    description: chargeReference.description,
    chargeCategoryCode: chargeReference.chargeCategoryId.value,
    chargeCategoryDescription: 'Test charge category',
    purposes: [{}],
    netAmount,
    credit: false
  }
}
