import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (returnLog) {
  return {
    id: generateUUID(),
    returnId: returnLog.returnId,
    returnLogId: returnLog.id,
    nilReturn: false,
    current: true
  }
}
