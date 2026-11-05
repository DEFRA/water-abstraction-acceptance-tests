import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (returnSubmission, period) {
  return {
    id: generateUUID(),
    returnSubmissionId: returnSubmission.id,
    startDate: period.startDate,
    endDate: period.endDate
  }
}
