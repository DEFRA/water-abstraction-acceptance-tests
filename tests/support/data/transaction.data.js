import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (billLicence, chargeReference, dates, netAmount) {
  let section130Agreement = chargeReference.scheme === 'sroc' ? 'false' : null

  if (chargeReference.section130Agreement) {
    section130Agreement = chargeReference.section130Agreement
  }

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
    section130Agreement,
    description: chargeReference.description,
    chargeCategoryCode: chargeReference.chargeCategoryId.value,
    chargeCategoryDescription: 'Test charge category',
    purposes: [{}],
    netAmount,
    credit: false
  }
}
