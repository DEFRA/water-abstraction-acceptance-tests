import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (bill, licence) {
  return {
    id: generateUUID(),
    billId: bill.id,
    licenceRef: licence.licenceRef,
    licenceId: licence.id
  }
}
