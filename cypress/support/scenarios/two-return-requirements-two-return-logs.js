import currentFinancialYear from '../helpers/currentFinancialYear.js'
import licence from '../fixture-builder/licence.js'
import points from '../fixture-builder/points.js'
import purposes from '../fixture-builder/purposes.js'
import returnLogs from '../fixture-builder/return-logs.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnRequirementPoints from '../fixture-builder/return-requirement-points.js'
import returnVersion from '../fixture-builder/return-version.js'

export default function basicLicenceTwoDifferentReturnRequirementsWithTwoReturnLogsEach () {
  const dataModel = {
    ...licence(),
    ...points(2),
    ...purposes(2),
    ...returnVersion(),
    ...returnRequirements(2),
    ...returnRequirementPoints(2),
    ...returnLogs(4)
  }

  const currentFinancialYearInfo = currentFinancialYear()

  const winter = { start: currentFinancialYearInfo.start.year, end: currentFinancialYearInfo.end.year }
  const summer = { start: currentFinancialYearInfo.start.year - 1, end: currentFinancialYearInfo.end.year - 1 }

  dataModel.returnLogs[0].returnId = `v1:9:AT/TE/ST/01/01:9999990:${winter.start}-04-01:${winter.end}-03-31`
  dataModel.returnLogs[0].dueDate = `${winter.end}-04-28`
  dataModel.returnLogs[0].endDate = `${winter.end}-03-31`
  dataModel.returnLogs[0].metadata.isSummer = false
  dataModel.returnLogs[0].startDate = `${winter.start}-04-01`
  dataModel.returnLogs[0].status = 'due'
  dataModel.returnLogs[0].returnCycleId.value = `${winter.start}-04-01`

  dataModel.returnLogs[1].returnId = `v1:9:AT/TE/ST/01/01:9999991:${summer.start}-11-01:${summer.end}-10-31`
  dataModel.returnLogs[1].dueDate = `${summer.end}-11-28`
  dataModel.returnLogs[1].endDate = `${summer.end}-10-31`
  dataModel.returnLogs[1].metadata.isSummer = true
  dataModel.returnLogs[1].startDate = `${summer.start}-11-01`
  dataModel.returnLogs[1].status = 'due'
  dataModel.returnLogs[1].returnCycleId.value = `${summer.start}-11-01`

  dataModel.returnLogs[2].returnId = `v1:9:AT/TE/ST/01/01:9999990:${winter.start - 1}-04-01:${winter.end - 1}-03-31`
  dataModel.returnLogs[2].dueDate = `${winter.end - 1}-04-28`
  dataModel.returnLogs[2].endDate = `${winter.end - 1}-03-31`
  dataModel.returnLogs[2].metadata.isSummer = false
  dataModel.returnLogs[2].startDate = `${winter.start - 1}-04-01`
  dataModel.returnLogs[2].returnCycleId.value = `${winter.start - 1}-04-01`

  dataModel.returnLogs[3].returnId = `v1:9:AT/TE/ST/01/01:9999991:${summer.start - 1}-11-01:${summer.end - 1}-10-31`
  dataModel.returnLogs[3].dueDate = `${summer.end - 1}-11-28`
  dataModel.returnLogs[3].endDate = `${summer.end - 1}-10-31`
  dataModel.returnLogs[3].metadata.isSummer = true
  dataModel.returnLogs[3].startDate = `${summer.start - 1}-11-01`
  dataModel.returnLogs[3].returnCycleId.value = `${summer.start - 1}-11-01`

  return dataModel
}
