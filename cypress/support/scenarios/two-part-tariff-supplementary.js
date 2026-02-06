import billRunsData from '../fixture-builder/bill-runs.js'
import billingAccountData from '../fixture-builder/billing-account.js'
import billingAccountAddressData from '../fixture-builder/billing-account-address.js'
import chargeElementsData from '../fixture-builder/charge-elements.js'
import chargeReferencesData from '../fixture-builder/charge-references.js'
import chargeVersionsData from '../fixture-builder/charge-versions.js'
import currentFinancialYear from '../helpers/currentFinancialYear.js'
import licenceAgreementData from '../fixture-builder/licence-agreement.js'
import licenceData from '../fixture-builder/licence.js'
import licenceVersionPurposesData from '../fixture-builder/licence-version-purposes.js'
import returnLogsData from '../fixture-builder/return-logs.js'

export default function twoPartTariffSupplementary () {
  const licenceRecords = _licenceRecords()
  const licenceRef = licenceRecords.licences[0].licenceRef

  const chargeInformation = _chargeInformation()

  const currentFinancialYearInfo = currentFinancialYear()
  const financialYearStartYear = currentFinancialYearInfo.start.year - 1
  const financialYearEndYear = currentFinancialYearInfo.end.year - 1

  const billRunRecords = _billRunRecords(financialYearEndYear, licenceRecords.licences[0].id)

  const returnStartDate = `${financialYearStartYear}-04-01`
  const returnEndDate = `${financialYearEndYear}-03-31`
  const returnDueDate = `${financialYearEndYear}-04-28`

  const returnLogs = returnLogsData(2).returnLogs

  const lvPurpose1 = licenceRecords.licenceVersionPurposes[0]

  returnLogs[0].id = 'fe7b131b-5998-4bc9-8446-98bcfde075b9'
  returnLogs[0].returnId = `v1:9:${licenceRef}:9999990:${returnStartDate}:${returnEndDate}`
  returnLogs[0].returnReference = '9999990'
  returnLogs[0].dueDate = returnDueDate
  returnLogs[0].endDate = returnEndDate
  returnLogs[0].metadata.description = 'Return for Spray Irrigation - Storage'
  returnLogs[0].metadata.nald.periodStartDay = lvPurpose1.abstractionPeriodStartDay
  returnLogs[0].metadata.nald.periodStartMonth = lvPurpose1.abstractionPeriodStartMonth
  returnLogs[0].metadata.nald.periodEndDay = lvPurpose1.abstractionPeriodEndDay
  returnLogs[0].metadata.nald.periodEndMonth = lvPurpose1.abstractionPeriodEndMonth
  returnLogs[0].metadata.points = [
    {
      name: licenceRecords.points[0].description,
      ngr1: licenceRecords.points[0].ngr1,
      ngr2: null,
      ngr3: null,
      ngr4: null
    }
  ]
  returnLogs[0].metadata.purposes[0].alias = 'SPRAY IRRIGATION STORAGE'
  returnLogs[0].metadata.purposes[0].tertiary.code = '140'
  returnLogs[0].metadata.purposes[0].tertiary.description = 'Spray Irrigation - Storage'
  returnLogs[0].startDate = returnStartDate
  returnLogs[0].status = 'due'
  returnLogs[0].returnCycleId.value = returnStartDate

  const lvPurpose2 = licenceRecords.licenceVersionPurposes[1]

  returnLogs[1].id = '87eed93a-a94a-4cff-8ef9-469d9794aa1c'
  returnLogs[1].returnId = `v1:9:${licenceRef}:9999991:${returnStartDate}:${returnEndDate}`
  returnLogs[1].returnReference = '9999991'
  // NOTE: We specifically want to process a return with no due date to confirm the bill run engine can handle dynamic
  // due dates. Going forward, all due returns will have a null due date, but complete returns can also have a null due
  // date if the return was submitted before the return invitation was sent.
  returnLogs[1].dueDate = null
  returnLogs[1].endDate = returnEndDate
  returnLogs[1].metadata.description = 'Return for Make-Up Or Top Up Water'
  returnLogs[1].metadata.nald.periodStartDay = lvPurpose2.abstractionPeriodStartDay
  returnLogs[1].metadata.nald.periodStartMonth = lvPurpose2.abstractionPeriodStartMonth
  returnLogs[1].metadata.nald.periodEndDay = lvPurpose2.abstractionPeriodEndDay
  returnLogs[1].metadata.nald.periodEndMonth = lvPurpose2.abstractionPeriodEndMonth
  returnLogs[1].metadata.points = [
    {
      name: licenceRecords.points[0].description,
      ngr1: licenceRecords.points[0].ngr1,
      ngr2: null,
      ngr3: null,
      ngr4: null
    }
  ]
  returnLogs[1].metadata.purposes[0].alias = 'MAKE-UP OR TOP UP WATER'
  returnLogs[1].metadata.purposes[0].tertiary.code = '280'
  returnLogs[1].metadata.purposes[0].tertiary.description = 'Make-Up Or Top Up Water'
  returnLogs[1].startDate = returnStartDate
  returnLogs[1].status = 'due'
  returnLogs[1].returnCycleId.value = returnStartDate

  return {
    ...licenceRecords,
    ...chargeInformation,
    ...billRunRecords,
    returnLogs
  }
}

function _billRunRecords (financialYearEndYear, licenceId) {
  const billRun = billRunsData().sroc.annual.twoPartTariff

  billRun.fromFinancialYearEnding = financialYearEndYear
  billRun.toFinancialYearEnding = financialYearEndYear

  const licenceSupplementaryYears = [
    {
      id: 'b6949b70-bca8-408b-b853-e453750bd8f0',
      licenceId,
      financialYearEnd: financialYearEndYear,
      twoPartTariff: true
    }
  ]

  return {
    billRuns: [billRun],
    licenceSupplementaryYears
  }
}

function _chargeInformation () {
  const billingAccount = billingAccountData()
  const billingAccountAddress = billingAccountAddressData()
  const chargeVersion = chargeVersionsData().sroc
  const chargeReference = chargeReferencesData().sroc

  chargeReference.adjustments.s127 = true
  chargeReference.section127Agreement = true

  const chargeElements = chargeElementsData(2).chargeElements
  for (const chargeElement of chargeElements) {
    chargeElement.section127Agreement = true
  }

  const licenceAgreement = licenceAgreementData()

  return {
    billingAccounts: [billingAccount],
    billingAccountAddresses: [billingAccountAddress],
    chargeVersions: [chargeVersion],
    chargeReferences: [chargeReference],
    chargeElements,
    licenceAgreements: [licenceAgreement]
  }
}

function _licenceRecords () {
  const licenceRecords = licenceData()

  // These are needed when you require a primary user for then licence. We don't so we delete them to reduce the load
  delete licenceRecords.licenceEntities
  delete licenceRecords.licenceEntityRoles

  // We want two return logs, which means we need we'd need a reason for two. Typically, its because a licence has multiple purposes or multiple points.
  // We're going for purposes, so we add an additional one to our licence version.
  const { licenceVersionPurposes } = licenceVersionPurposesData(2)

  const additionalLicenceVersionPurpose = licenceVersionPurposes[1]

  additionalLicenceVersionPurpose.licenceVersionId = licenceRecords.licenceVersions[0].id

  licenceRecords.licenceVersionPurposes.push(additionalLicenceVersionPurpose)
  licenceRecords.licenceVersionPurposePoints.push({
    id: '0dd4b0b0-4756-4a62-9fc8-892617bcb21a',
    licenceVersionPurposeId: additionalLicenceVersionPurpose.id,
    pointId: licenceRecords.points[0].id
  })

  return licenceRecords
}
