import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licence) {
  const licenceDocumentId = generateUUID()

  return {
    id: licenceDocumentId,
    licenceRef: licence.licenceRef,
    startDate: licence.startDate
  }
}
