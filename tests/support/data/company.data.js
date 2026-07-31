import { generateUUID } from '../helpers/generate-uuid.js'
import { companyName } from '../default-values.js'

export default function () {
  const companyId = generateUUID()

  return {
    id: companyId,
    name: companyName,
    type: 'organisation'
  }
}
