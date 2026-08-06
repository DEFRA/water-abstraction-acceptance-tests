import { generateUUID } from '../helpers/generate-uuid.js'

export default function (billLicence, chargeReference, dates, netAmount) {
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
    chargeCategoryCode: '4.6.1',
    chargeCategoryDescription: 'Test charge category',
    purposes: [{}],
    netAmount,
    credit: false
  }
}
