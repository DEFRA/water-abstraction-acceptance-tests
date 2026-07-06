import licenceWithReturnLogScenario from './return-log.scenario.js'
import registeredLicenceScenario from './registered-licence.scenario.js'
import { compareDates, previousPeriod, today } from '../helpers/date.helpers.js'

export const title = 'Licence with a due return log'
export const description =
  'Licence with a due return log on a submittable past return period, with return requirements and version'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  // If the first return period ends in the future, we won't be able to interact with it. This scenario was written
  // for a number of our return log tests, that check we can add various types of return submissions. To ensure we
  // can interact with the return log, we bump the period back by one, so it ends in the past.
  let returnPeriod = firstReturnPeriod

  if (!compareDates(firstReturnPeriod.endDate, today())) {
    returnPeriod = previousPeriod(firstReturnPeriod)
  }

  const registeredLicence = registeredLicenceScenario()

  return licenceWithReturnLogScenario(
    {
      startDate: returnPeriod.startDate,
      endDate: returnPeriod.endDate,
      dueDate: returnPeriod.dueDate,
      quarterly: returnPeriod.quarterly
    },
    registeredLicence
  )
}
