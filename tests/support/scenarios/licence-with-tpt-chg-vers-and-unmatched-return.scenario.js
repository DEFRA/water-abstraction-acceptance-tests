import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with tpt charge version and an unmatched return'
export const description =
  'Licence with a return version and a TPT charge version whose charge element and completed return have different two-part tariff purposes, so the return cannot match the element'

export default function () {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceWithTwoPurposesScenario()

  const [elementPurpose, returnPurpose] = licence.licenceVersionPurposes
  const [, returnPoint] = licence.points

  // The charge element and the return use different two-part tariff purposes (400 Spray Irrigation - Direct and 420
  // Spray Irrigation - Storage), so the return cannot match the element and is left unmatched.
  returnPurpose.purposeId.value = '420'

  const chargeVersionEntity = buildChargeVersionEntity(
    licence.company,
    licence.address,
    licence.licence,
    elementPurpose
  )

  const returnVersionEntity = buildReturnVersionEntity(licence.licence, returnPurpose, returnPoint)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousReturnLog, currentReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    returnPoint,
    periods
  )

  previousReturnLog.status = 'completed'

  // The return submits its authorised quantity but has no charge element to allocate to, so it is left over-abstracted.
  const returnSubmissionEntity = buildReturnSubmissionEntity(previousReturnLog, returnPurpose.annualQuantity)

  return {
    ...licence,
    ...chargeVersionEntity,
    ...returnVersionEntity,
    returnLogs: [previousReturnLog, currentReturnLog],
    ...returnSubmissionEntity
  }
}
