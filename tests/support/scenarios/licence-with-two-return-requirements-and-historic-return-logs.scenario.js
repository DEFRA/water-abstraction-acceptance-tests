import { generateLicenceVersionPurposeExternalId } from 'water-abstraction-engine/test/generators.js'

import buildLicenceEntity from '../entities/licence.entity.js'
import { buildPreviousAndCurrentReturnLogs } from '../helpers/return-log.helpers.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { generatePointExternalId } from '../helpers/generators.helpers.js'
import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../data/licence-version-purpose-point.data.js'
import pointData from '../data/point.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'

export const title = 'Licence with two return requirements and historic return logs'
export const description =
  'Licence with two return requirements, each tied to its own abstraction point, and each with a due return log ' +
  'for the current cycle plus a completed return log for the previous cycle'

export default function () {
  const { currentWinterReturnCycle } = calculatedDates()

  currentWinterReturnCycle.dueDate = null

  const licenceWithTwoReturnRequirements = _licenceWithTwoReturnRequirements()

  const [firstRequirement, secondRequirement] = licenceWithTwoReturnRequirements.returnRequirements
  const [firstPoint, secondPoint] = licenceWithTwoReturnRequirements.points
  const [firstRequirementPurpose, secondRequirementPurpose] = licenceWithTwoReturnRequirements.returnRequirementPurposes

  const returnLogs = [
    ...buildPreviousAndCurrentReturnLogs(
      licenceWithTwoReturnRequirements.licence,
      firstRequirement,
      firstRequirementPurpose,
      firstPoint,
      currentWinterReturnCycle
    ),
    ...buildPreviousAndCurrentReturnLogs(
      licenceWithTwoReturnRequirements.licence,
      secondRequirement,
      secondRequirementPurpose,
      secondPoint,
      currentWinterReturnCycle
    )
  ]

  return {
    ...licenceWithTwoReturnRequirements,
    returnLogs
  }
}

/**
 * Builds a licence with two return requirements, each tied to its own abstraction point and purpose
 *
 * @private
 */
function _licenceWithTwoReturnRequirements() {
  const licenceEntity = buildLicenceEntity()

  const secondPoint = pointData()
  secondPoint.description = 'Example point 2'
  secondPoint.ngr1 = 'TQ 1234 5679'
  secondPoint.externalId = generatePointExternalId()

  const secondLicenceVersionPurpose = licenceVersionPurposeData(licenceEntity.licenceVersion)
  secondLicenceVersionPurpose.purposeId.value = '420'
  secondLicenceVersionPurpose.externalId = generateLicenceVersionPurposeExternalId()
  const secondLicenceVersionPurposePoint = licenceVersionPurposePointData(secondLicenceVersionPurpose, secondPoint)

  const returnVersionEntity = buildReturnVersionEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  const secondReturnRequirement = returnRequirementData(returnVersionEntity.returnVersion, secondLicenceVersionPurpose)
  const secondReturnRequirementPoint = returnRequirementPointData(secondReturnRequirement, secondPoint)
  const secondReturnRequirementPurpose = returnRequirementPurposeData(
    secondReturnRequirement,
    secondLicenceVersionPurpose
  )

  return {
    ...licenceEntity,
    points: [licenceEntity.point, secondPoint],
    licenceVersionPurposes: [licenceEntity.licenceVersionPurpose, secondLicenceVersionPurpose],
    licenceVersionPurposePoints: [licenceEntity.licenceVersionPurposePoint, secondLicenceVersionPurposePoint],
    returnVersion: returnVersionEntity.returnVersion,
    returnRequirements: [returnVersionEntity.returnRequirement, secondReturnRequirement],
    returnRequirementPoints: [returnVersionEntity.returnRequirementPoint, secondReturnRequirementPoint],
    returnRequirementPurposes: [returnVersionEntity.returnRequirementPurpose, secondReturnRequirementPurpose]
  }
}
