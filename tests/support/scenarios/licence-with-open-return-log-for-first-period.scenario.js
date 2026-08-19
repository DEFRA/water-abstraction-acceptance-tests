import returnLogData from '../data/return-log.data.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { compareDates } from '../helpers/date.helpers.js'

export const title = 'Licence with open return log (first period)'
export const description = 'Licence with an open return log for the first return period with no due date set'

export default function () {
  const dates = calculatedDates()

  const { firstReturnPeriod } = dates

  const firstPeriod = {
    startDate: new Date(firstReturnPeriod.startDate),
    endDate: new Date(firstReturnPeriod.endDate),
    dueDate: null,
    quarterly: firstReturnPeriod.quarterly
  }

  const licenceEntity = buildLicenceEntity()

  // We want the return logs for the licence to match with the first quarter shown in the journey. This is dynamically
  // calculated based on the current date, so could be a quarterly period, or the winter or summer cycle.
  // Only licences flagged as water undertakers are eligible for quarterly returns, so we ensure the licence aligns.
  licenceEntity.licence.waterUndertaker = firstPeriod.quarterly

  const returnVersionEntity = buildReturnVersionEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  const periods = _periods(firstPeriod, dates)
  const returnLogs = periods.map((period) => {
    return returnLogData(
      licenceEntity.licence,
      returnVersionEntity.returnRequirement,
      [returnVersionEntity.returnRequirementPurpose],
      [licenceEntity.point],
      period
    )
  })

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersionEntity.returnVersion.startDate = returnLogs[0].startDate

  return {
    ...licenceEntity,
    ...returnVersionEntity,
    returnLogs
  }
}

/**
 * Determines which quarterly periods (if any) need covering with return logs
 *
 * If the first period is not a quarterly period, then we will be generating an annual (winter or summer) return log
 * that covers the entire cycle.
 *
 * If it's quarterly though, it will only cover a 3 month period of the cycle. That's fine if its the last one (Jan to
 * Mar), but if its an earlier one, we need to generate return logs for the remaining quarterly periods in the cycle.
 *
 * This function determines which periods we need to generate return logs for, and returns them in an array.
 *
 * @private
 */
function _periods(firstPeriod, dates) {
  const periods = [firstPeriod]

  if (!firstPeriod.quarterly) {
    return periods
  }

  for (const quarterlyPeriod of dates.quarterlyPeriods) {
    if (compareDates(new Date(quarterlyPeriod.startDate), firstPeriod.startDate) === 1) {
      periods.push({
        startDate: new Date(quarterlyPeriod.startDate),
        endDate: new Date(quarterlyPeriod.endDate),
        dueDate: null,
        quarterly: true
      })
    }
  }

  return periods
}
