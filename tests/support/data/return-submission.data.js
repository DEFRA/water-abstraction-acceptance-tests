import { generateUUID } from '../helpers/generate-uuid.js'

export default function (returnLog) {
  return {
    id: generateUUID(),
    returnId: returnLog.returnId,
    returnLogId: returnLog.id,
    nilReturn: false,
    current: true
  }
}
