import currentFinancialYear from '../helpers/currentFinancialYear.js'
import licence from '../fixture-builder/licence.js'
import points from '../fixture-builder/points.js'
import purposes from '../fixture-builder/purposes.js'
import returnLogs from '../fixture-builder/return-logs.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnRequirementPoints from '../fixture-builder/return-requirement-points.js'
import returnVersion from '../fixture-builder/return-version.js'

export default function basicLicenceTwoReturnRequirementsWithThreeReturnLogsEach () {
  const dataModel = {
    ...licence(),
    ...points(2),
    ...purposes(2),
    ...returnVersion(),
    ...returnRequirements(2),
    ...returnRequirementPoints(2),
    ...returnLogs(6)
  }

  const currentFinancialYearInfo = currentFinancialYear()

  let startYear = currentFinancialYearInfo.start.year
  let endYear = currentFinancialYearInfo.end.year

  dataModel.returnLogs[0].id = `v1:9:AT/TE/ST/01/01:9999990:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[0].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[0].endDate = `${endYear}-03-31`
  dataModel.returnLogs[0].metadata.isSummer = false
  dataModel.returnLogs[0].startDate = `${startYear}-04-01`
  dataModel.returnLogs[0].status = 'due'
  dataModel.returnLogs[0].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[1].id = `v1:9:AT/TE/ST/01/01:9999991:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[1].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[1].endDate = `${endYear}-03-31`
  dataModel.returnLogs[1].metadata.isSummer = false
  dataModel.returnLogs[1].startDate = `${startYear}-04-01`
  dataModel.returnLogs[1].status = 'due'
  dataModel.returnLogs[1].returnCycleId.value = `${startYear}-04-01`
  dataModel.returnLogs[1].returnReference = '9999991'

  startYear = startYear - 1
  endYear = endYear - 1

  dataModel.returnLogs[2].id = `v1:9:AT/TE/ST/01/01:9999990:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[2].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[2].endDate = `${endYear}-03-31`
  dataModel.returnLogs[2].metadata.isSummer = false
  dataModel.returnLogs[2].startDate = `${startYear}-04-01`
  dataModel.returnLogs[2].status = 'completed'
  dataModel.returnLogs[2].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[3].id = `v1:9:AT/TE/ST/01/01:9999991:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[3].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[3].endDate = `${endYear}-03-31`
  dataModel.returnLogs[3].metadata.isSummer = false
  dataModel.returnLogs[3].startDate = `${startYear}-04-01`
  dataModel.returnLogs[3].status = 'completed'
  dataModel.returnLogs[3].returnCycleId.value = `${startYear}-04-01`
  dataModel.returnLogs[3].returnReference = '9999991'

  startYear = startYear - 1
  endYear = endYear - 1

  dataModel.returnLogs[4].id = `v1:9:AT/TE/ST/01/01:9999990:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[4].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[4].endDate = `${endYear}-03-31`
  dataModel.returnLogs[4].metadata.isSummer = false
  dataModel.returnLogs[4].startDate = `${startYear}-04-01`
  dataModel.returnLogs[4].status = 'completed'
  dataModel.returnLogs[4].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[5].id = `v1:9:AT/TE/ST/01/01:9999991:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[5].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[5].endDate = `${endYear}-03-31`
  dataModel.returnLogs[5].metadata.isSummer = false
  dataModel.returnLogs[5].startDate = `${startYear}-04-01`
  dataModel.returnLogs[5].status = 'completed'
  dataModel.returnLogs[5].returnCycleId.value = `${startYear}-04-01`
  dataModel.returnLogs[5].returnReference = '9999991'

  return dataModel
}
