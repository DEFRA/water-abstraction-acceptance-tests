import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (licence) {
  const licenceDocumentId = generateUUID()

  return {
    id: licenceDocumentId,
    licenceRef: licence.licenceRef,
    startDate: licence.startDate
  }
}
