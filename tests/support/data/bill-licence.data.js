import { generateUUID } from '../helpers/generate-uuid.js'

export default function (bill, licence) {
  return {
    id: generateUUID(),
    billId: bill.id,
    licenceRef: licence.licenceRef,
    licenceId: licence.id
  }
}
