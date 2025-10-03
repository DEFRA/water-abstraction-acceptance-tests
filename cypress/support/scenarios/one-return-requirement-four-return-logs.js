import currentFinancialYear from '../helpers/currentFinancialYear.js'
import licence from '../fixture-builder/licence.js'
import points from '../fixture-builder/points.js'
import purposes from '../fixture-builder/purposes.js'
import returnLogs from '../fixture-builder/return-logs.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnRequirementPoints from '../fixture-builder/return-requirement-points.js'
import returnVersion from '../fixture-builder/return-version.js'

export default function basicLicenceOneReturnRequirementsWithFourReturnLogs () {
  const dataModel = {
    ...licence(),
    ...points(),
    ...purposes(),
    ...returnVersion(),
    ...returnRequirements(),
    ...returnRequirementPoints(),
    ...returnLogs()
  }

  const currentFinancialYearInfo = currentFinancialYear()

  const startYear = currentFinancialYearInfo.start.year
  const endYear = currentFinancialYearInfo.end.year

  for (let i = 0; i < dataModel.returnLogs.length; i++) {
    dataModel.returnLogs[i].id = `v1:9:AT/TEST/01:9999990:${startYear - i}-04-01:${endYear - i}-03-31`
    dataModel.returnLogs[i].dueDate = `${endYear - i}-04-28`
    dataModel.returnLogs[i].endDate = `${endYear - i}-03-31`
    dataModel.returnLogs[i].startDate = `${startYear - i}-04-01`
    dataModel.returnLogs[i].returnCycleId.value = `${startYear - i}-04-01`
  }

  return dataModel
}
