import currentFinancialYear from '../helpers/currentFinancialYear.js'
import licence from '../fixture-builder/licence.js'
import points from '../fixture-builder/points.js'
import purposes from '../fixture-builder/purposes.js'
import returnLogs from '../fixture-builder/return-logs.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnRequirementPoints from '../fixture-builder/return-requirement-points.js'
import returnVersion from '../fixture-builder/return-version.js'

export default function basicLicenceOneReturnRequirementQuarterlyReturns () {
  const dataModel = {
    ...licence(),
    ...points(),
    ...purposes(),
    ...returnVersion(),
    ...returnRequirements(),
    ...returnRequirementPoints(),
    ...returnLogs(4)
  }

  const currentFinancialYearInfo = currentFinancialYear()

  const startYear = currentFinancialYearInfo.start.year
  const endYear = currentFinancialYearInfo.end.year

  dataModel.returnLogs[0].id = `v1:9:AT/TE/ST/01/01:9999990:${startYear + 1}-01-01:${endYear}-03-31`
  dataModel.returnLogs[0].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[0].endDate = `${endYear}-03-31`
  dataModel.returnLogs[0].startDate = `${endYear}-01-01`
  dataModel.returnLogs[0].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[1].id = `v1:9:AT/TE/ST/01/01:9999990:${startYear}-10-01:${startYear}-12-31`
  dataModel.returnLogs[1].dueDate = `${endYear}-01-28`
  dataModel.returnLogs[1].endDate = `${startYear}-12-31`
  dataModel.returnLogs[1].startDate = `${startYear}-10-01`
  dataModel.returnLogs[1].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[2].id = `v1:9:AT/TE/ST/01/01:9999990:${startYear}-07-01:${startYear}-09-30`
  dataModel.returnLogs[2].dueDate = `${startYear}-10-28`
  dataModel.returnLogs[2].endDate = `${startYear}-09-30`
  dataModel.returnLogs[2].startDate = `${startYear}-07-01`
  dataModel.returnLogs[2].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[3].id = `v1:9:AT/TE/ST/01/01:9999990:${startYear}-04-01:${startYear}-06-30`
  dataModel.returnLogs[3].dueDate = `${startYear}-07-28`
  dataModel.returnLogs[3].endDate = `${startYear}-06-30`
  dataModel.returnLogs[3].startDate = `${startYear}-04-01`
  dataModel.returnLogs[3].returnCycleId.value = `${startYear}-04-01`

  return dataModel
}
