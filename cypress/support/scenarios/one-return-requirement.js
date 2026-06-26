import licence from '../fixture-builder/licence.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnVersion from '../fixture-builder/return-version.js'

export const title = 'One return requirement'
export const description = 'Licence with a single return requirement and version, but no return logs'

export default function () {
  return {
    ...licence(),
    ...returnVersion(),
    ...returnRequirements()
  }
}
