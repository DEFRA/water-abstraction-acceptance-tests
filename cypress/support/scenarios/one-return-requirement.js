import licence from '../fixture-builder/licence.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnVersion from '../fixture-builder/return-version.js'

export default function basicLicenceOneReturnRequirement () {
  return {
    ...licence(),
    ...returnVersion(),
    ...returnRequirements()
  }
}
