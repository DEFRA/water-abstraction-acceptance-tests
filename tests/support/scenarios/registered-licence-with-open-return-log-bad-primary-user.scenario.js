import registeredLicenceScenario from './registered-licence.scenario.js'
import { compareDates, previousPeriod, today } from '../helpers/date.helpers.js'
import licenceWithReturnLogScenario from './return-log.scenario.js'

export const title = 'Open return log with bad primary user'
export const description =
  "Licence registered to a 'bad' external user with a due return log for testing submissions with unverified contacts"

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  // If the first return period ends in the future, we won't be able to interact with it. This scenario was written
  // for a number of our return log tests, that check we can add various types of return submissions. To ensure we
  // can interact with the return log, we bump the period back by one, so it ends in the past.
  let returnPeriod = firstReturnPeriod

  if (!compareDates(firstReturnPeriod.endDate, today())) {
    returnPeriod = previousPeriod(firstReturnPeriod)
  }

  const registeredLicence = registeredLicenceScenario('AT/TE/ST/01/01', 'iwill-fail@e')

  const {
    addresses: [address]
  } = registeredLicence

  // We'll only set the due date on the OPEN return log if the alternate notification is successful. The Notify
  // service will reject the request if the address is not real, even though we're using our Notify test API key.
  // This is why we override the address record that will be linked to the licence's licence holder.
  address.address1 = 'HORIZON HOUSE'
  address.address2 = 'DEANERY ROAD'
  address.address3 = null
  address.address4 = null
  address.address5 = null
  address.address6 = null
  address.postcode = 'BS1 5AH'

  return licenceWithReturnLogScenario(
    {
      startDate: returnPeriod.startDate,
      endDate: returnPeriod.endDate,
      dueDate: null,
      quarterly: returnPeriod.quarterly
    },
    registeredLicence
  )
}
