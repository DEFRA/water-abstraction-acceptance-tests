import licenceData from '../fixture-builder/licence.js'
import returnLogs from '../fixture-builder/return-logs.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnVersion from '../fixture-builder/return-version.js'
import usersData from '../fixture-builder/users.js'
import { compareDates, formatDateToIso, previousPeriod, today } from '../helpers/date.helpers.js'

export const title = 'Open return log with bad primary user'
export const description = "Licence registered to a 'bad' external user with a due return log for testing submissions with unverified contacts"

export default function (currentServiceData) {
  const { firstReturnPeriod } = currentServiceData

  let returnPeriod = firstReturnPeriod

  // If the first return period ends in the future, we won't be able to interact with it. This scenario was written
  // for a number of our return log tests, that check we can add various types of return submissions.
  // To ensure we can interact with the return log, we bump the period back by one, so it ends in the past.
  if (!compareDates(firstReturnPeriod.endDate, today())) {
    returnPeriod = previousPeriod(firstReturnPeriod)
  }

  const endDate = new Date(returnPeriod.endDate)
  const startDate = new Date(returnPeriod.startDate)

  const endDateString = formatDateToIso(endDate)
  const startDateString = formatDateToIso(startDate)

  const dataModel = {
    ...licenceData(),
    ...returnVersion(),
    ...returnRequirements(),
    ...returnLogs(1)
  }

  // We'll only set the due date on the OPEN return log if the alternate notification is successful. The Notify service
  // will reject the request if the address is not real, even though we're using our Notify test API key. This is why
  // we update the address record that will be linked to the licence's licence holder.
  dataModel.addresses = [
    {
      id: '62549cdb-073f-4d5c-a2a1-c47b0b910010',
      address1: 'HORIZON HOUSE',
      address2: 'DEANERY ROAD',
      postcode: 'BS1 5AH',
      country: 'UK',
      dataSource: 'nald'
    }
  ]

  // For the licence to be flagged as registered, we have to link the 'bad' user record to the licence via the licence
  // entity record. For completeness, we also ensure the entity name matches our 'bad' user's username, but this is not
  // essential for the licence to be registered.
  const primaryUser = usersData().externalBad
  primaryUser.licenceEntityId = dataModel.licenceEntities[0].id
  dataModel.licenceEntities[0].name = primaryUser.username

  dataModel.users = [primaryUser]

  dataModel.returnLogs[0].dueDate = null
  dataModel.returnLogs[0].endDate = endDateString
  dataModel.returnLogs[0].id = '7f6ff22b-f7f6-4f37-a29e-244fad5a22eb'
  dataModel.returnLogs[0].metadata.description = dataModel.returnRequirements[0].siteDescription
  dataModel.returnLogs[0].metadata.isSummer = dataModel.returnRequirements[0].summer
  dataModel.returnLogs[0].returnCycleId.value = `${startDate.getFullYear()}-04-01`
  dataModel.returnLogs[0].returnId = `v1:8:AT/TE/ST/01/01:9999990:${startDateString}:${endDateString}`
  dataModel.returnLogs[0].returnReference = dataModel.returnRequirements[0].legacyId
  dataModel.returnLogs[0].returnRequirementId = dataModel.returnRequirements[0].id
  dataModel.returnLogs[0].startDate = startDateString
  dataModel.returnLogs[0].status = 'due'
  dataModel.returnLogs[0].quarterly = returnPeriod.quarterly

  return dataModel
}
