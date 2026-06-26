import licenceData from '../fixture-builder/licence.js'
import returnLogs from '../fixture-builder/return-logs.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnVersion from '../fixture-builder/return-version.js'
import { formatDateToIso } from '../helpers/date.helpers.js'

export const title = 'Unregistered licence with a completed return log (current period)'
export const description = 'Unregistered licence with a completed return log for the first current return period with no due date set'

export default function (currentServiceData) {
  const { firstReturnPeriod } = currentServiceData

  const endDate = new Date(firstReturnPeriod.endDate)
  const startDate = new Date(firstReturnPeriod.startDate)

  const endDateString = formatDateToIso(endDate)
  const startDateString = formatDateToIso(startDate)

  const dataModel = {
    ...licenceData(),
    ...returnVersion(),
    ...returnRequirements(),
    ...returnLogs(1)
  }

  // Update the licence data to reflect this is unregistered
  dataModel.licenceDocumentHeaders[0].companyEntityId = null
  delete dataModel.licenceEntityRoles
  delete dataModel.licenceEntities

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
  dataModel.returnLogs[0].status = 'completed'
  dataModel.returnLogs[0].quarterly = firstReturnPeriod.quarterly

  return dataModel
}
