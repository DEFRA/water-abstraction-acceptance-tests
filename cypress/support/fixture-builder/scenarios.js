import currentFinancialYear from '../helpers/currentFinancialYear.js'
import licence from './licence.js'
import points from './points.js'
import purposes from './purposes.js'
import returnLogs from './return-logs.js'
import returnRequirements from './return-requirements.js'
import returnRequirementPoints from './return-requirement-points.js'
import returnVersion from './return-version.js'

export function basicLicenceOneReturnRequirement () {
  return {
    ...licence(),
    ...returnVersion(),
    ...returnRequirements()
  }
}

export function basicLicenceOneReturnRequirementQuarterlyReturns () {
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

  dataModel.returnLogs[0].id = `v1:9:AT/CURR/DAILY/01:9999990:${startYear + 1}-01-01:${endYear}-03-31`
  dataModel.returnLogs[0].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[0].endDate = `${endYear}-03-31`
  dataModel.returnLogs[0].startDate = `${endYear}-01-01`
  dataModel.returnLogs[0].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[1].id = `v1:9:AT/CURR/DAILY/01:9999990:${startYear}-10-01:${startYear}-12-31`
  dataModel.returnLogs[1].dueDate = `${endYear}-01-28`
  dataModel.returnLogs[1].endDate = `${startYear}-12-31`
  dataModel.returnLogs[1].startDate = `${startYear}-10-01`
  dataModel.returnLogs[1].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[2].id = `v1:9:AT/CURR/DAILY/01:9999990:${startYear}-07-01:${startYear}-09-30`
  dataModel.returnLogs[2].dueDate = `${startYear}-10-28`
  dataModel.returnLogs[2].endDate = `${startYear}-09-30`
  dataModel.returnLogs[2].startDate = `${startYear}-07-01`
  dataModel.returnLogs[2].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[3].id = `v1:9:AT/CURR/DAILY/01:9999990:${startYear}-04-01:${startYear}-06-30`
  dataModel.returnLogs[3].dueDate = `${startYear}-07-28`
  dataModel.returnLogs[3].endDate = `${startYear}-06-30`
  dataModel.returnLogs[3].startDate = `${startYear}-04-01`
  dataModel.returnLogs[3].returnCycleId.value = `${startYear}-04-01`

  return dataModel
}

export function basicLicenceTwoReturnRequirementsWithPoints () {
  return {
    ...licence(),
    ...points(2),
    ...purposes(2),
    ...returnVersion(),
    ...returnRequirements(2),
    ...returnRequirementPoints(2)
  }
}

export function basicLicenceOneReturnRequirementsWithTwoPoints () {
  const dataModel = {
    ...licence(),
    ...points(2),
    ...purposes(2),
    ...returnVersion(),
    ...returnRequirements(),
    ...returnRequirementPoints(2)
  }

  dataModel.returnRequirementPoints[1].returnRequirementId = dataModel.returnRequirements[0].id

  return dataModel
}

export function basicLicenceOneReturnRequirementsWithFourReturnLogs () {
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
    dataModel.returnLogs[i].id = `v1:9:AT/CURR/DAILY/01:9999990:${startYear - i}-04-01:${endYear - i}-03-31`
    dataModel.returnLogs[i].dueDate = `${endYear - i}-04-28`
    dataModel.returnLogs[i].endDate = `${endYear - i}-03-31`
    dataModel.returnLogs[i].startDate = `${startYear - i}-04-01`
    dataModel.returnLogs[i].returnCycleId.value = `${startYear - i}-04-01`
  }

  return dataModel
}

export function basicLicenceTwoDifferentReturnRequirementsWithTwoReturnLogsEach () {
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

  dataModel.returnLogs[0].id = `v1:9:AT/CURR/DAILY/01:9999990:${winter.start}-04-01:${winter.end}-03-31`
  dataModel.returnLogs[0].dueDate = `${winter.end}-04-28`
  dataModel.returnLogs[0].endDate = `${winter.end}-03-31`
  dataModel.returnLogs[0].metadata.isSummer = false
  dataModel.returnLogs[0].startDate = `${winter.start}-04-01`
  dataModel.returnLogs[0].status = 'due'
  dataModel.returnLogs[0].returnCycleId.value = `${winter.start}-04-01`

  dataModel.returnLogs[1].id = `v1:9:AT/CURR/DAILY/01:9999991:${summer.start}-11-01:${summer.end}-10-31`
  dataModel.returnLogs[1].dueDate = `${summer.end}-11-28`
  dataModel.returnLogs[1].endDate = `${summer.end}-10-31`
  dataModel.returnLogs[1].metadata.isSummer = true
  dataModel.returnLogs[1].startDate = `${summer.start}-11-01`
  dataModel.returnLogs[1].status = 'due'
  dataModel.returnLogs[1].returnCycleId.value = `${summer.start}-11-01`

  dataModel.returnLogs[2].id = `v1:9:AT/CURR/DAILY/01:9999990:${winter.start - 1}-04-01:${winter.end - 1}-03-31`
  dataModel.returnLogs[2].dueDate = `${winter.end - 1}-04-28`
  dataModel.returnLogs[2].endDate = `${winter.end - 1}-03-31`
  dataModel.returnLogs[2].metadata.isSummer = false
  dataModel.returnLogs[2].startDate = `${winter.start - 1}-04-01`
  dataModel.returnLogs[2].returnCycleId.value = `${winter.start - 1}-04-01`

  dataModel.returnLogs[3].id = `v1:9:AT/CURR/DAILY/01:9999991:${summer.start - 1}-11-01:${summer.end - 1}-10-31`
  dataModel.returnLogs[3].dueDate = `${summer.end - 1}-11-28`
  dataModel.returnLogs[3].endDate = `${summer.end - 1}-10-31`
  dataModel.returnLogs[3].metadata.isSummer = true
  dataModel.returnLogs[3].startDate = `${summer.start - 1}-11-01`
  dataModel.returnLogs[3].returnCycleId.value = `${summer.start - 1}-11-01`

  return dataModel
}



export function basicLicenceTwoReturnRequirementsWithThreeReturnLogsEach () {
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

  dataModel.returnLogs[0].id = `v1:9:AT/CURR/DAILY/01:9999990:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[0].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[0].endDate = `${endYear}-03-31`
  dataModel.returnLogs[0].metadata.isSummer = false
  dataModel.returnLogs[0].startDate = `${startYear}-04-01`
  dataModel.returnLogs[0].status = 'due'
  dataModel.returnLogs[0].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[1].id = `v1:9:AT/CURR/DAILY/01:9999991:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[1].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[1].endDate = `${endYear}-03-31`
  dataModel.returnLogs[1].metadata.isSummer = false
  dataModel.returnLogs[1].startDate = `${startYear}-04-01`
  dataModel.returnLogs[1].status = 'due'
  dataModel.returnLogs[1].returnCycleId.value = `${startYear}-04-01`
  dataModel.returnLogs[1].returnReference = '9999991'

  startYear = startYear - 1
  endYear = endYear - 1

  dataModel.returnLogs[2].id = `v1:9:AT/CURR/DAILY/01:9999990:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[2].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[2].endDate = `${endYear}-03-31`
  dataModel.returnLogs[2].metadata.isSummer = false
  dataModel.returnLogs[2].startDate = `${startYear}-04-01`
  dataModel.returnLogs[2].status = 'completed'
  dataModel.returnLogs[2].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[3].id = `v1:9:AT/CURR/DAILY/01:9999991:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[3].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[3].endDate = `${endYear}-03-31`
  dataModel.returnLogs[3].metadata.isSummer = false
  dataModel.returnLogs[3].startDate = `${startYear}-04-01`
  dataModel.returnLogs[3].status = 'completed'
  dataModel.returnLogs[3].returnCycleId.value = `${startYear}-04-01`
  dataModel.returnLogs[3].returnReference = '9999991'

  startYear = startYear - 1
  endYear = endYear - 1

  dataModel.returnLogs[4].id = `v1:9:AT/CURR/DAILY/01:9999990:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[4].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[4].endDate = `${endYear}-03-31`
  dataModel.returnLogs[4].metadata.isSummer = false
  dataModel.returnLogs[4].startDate = `${startYear}-04-01`
  dataModel.returnLogs[4].status = 'completed'
  dataModel.returnLogs[4].returnCycleId.value = `${startYear}-04-01`

  dataModel.returnLogs[5].id = `v1:9:AT/CURR/DAILY/01:9999991:${startYear}-04-01:${endYear}-03-31`
  dataModel.returnLogs[5].dueDate = `${endYear}-04-28`
  dataModel.returnLogs[5].endDate = `${endYear}-03-31`
  dataModel.returnLogs[5].metadata.isSummer = false
  dataModel.returnLogs[5].startDate = `${startYear}-04-01`
  dataModel.returnLogs[5].status = 'completed'
  dataModel.returnLogs[5].returnCycleId.value = `${startYear}-04-01`
  dataModel.returnLogs[5].returnReference = '9999991'

  return dataModel
}
