import billRunData from '../support/data/bill-run.data.js'
import buildBillEntity from '../support/entities/bill.entity.js'
import buildBillingAccountEntity from '../support/entities/billing-account.entity.js'
import buildChargeVersionEntity from '../support/entities/charge-version.entity.js'
import buildLicenceEntity from '../support/entities/licence.entity.js'
import { calculatedDates } from '../support/helpers/calculated-dates.helpers.js'
import { mergeByKey } from '../support/helpers/scenario.helpers.js'
import { previousYears, today } from '../support/helpers/date.helpers.js'
import { regions, srocStartDate } from '../support/default-values.js'

/**
 * Builds a sent annual bill run for every sroc financial year, and licences with a bill in each of them
 *
 * @param {number} [many=10] - the number of licences to build
 *
 * @returns {object} the world data, keyed by table name
 */
export default function (many = 10) {
  const region = regions.NORTH_WEST

  const { currentFinancialYear } = calculatedDates()

  const billRunPeriods = _billRuns(region, currentFinancialYear)
  const billRuns = billRunPeriods.map(({ billRun }) => {
    return billRun
  })

  const licences = _supplementaryLicences(many, region, billRunPeriods)

  const data = mergeByKey({ billRuns }, ...licences)

  _updateBillRunTotals(billRuns, data.bills)

  return data
}

function _billRuns(region, dates) {
  const billRunPeriods = []

  const chargeVersionStartDate = new Date(srocStartDate)
  const currentPeriodStartDate = new Date(dates.startDate)
  const yearsBack = Math.max(0, currentPeriodStartDate.getFullYear() - chargeVersionStartDate.getFullYear())

  for (let offset = 0; offset <= yearsBack; offset++) {
    const period = {
      startDate: previousYears(dates.startDate, offset),
      endDate: previousYears(dates.endDate, offset)
    }

    const billRun = billRunData(region)

    billRun.fromFinancialYearEnding = new Date(period.endDate).getUTCFullYear()
    billRun.toFinancialYearEnding = new Date(period.endDate).getUTCFullYear()

    if (offset > 0) {
      billRun.createdAt = previousYears(today(), offset)
    } else {
      billRun.createdAt = today()
    }

    billRunPeriods.push({ billRun, period })
  }

  return billRunPeriods
}

function _supplementaryLicences(many, region, billRunPeriods) {
  const licences = []

  for (let i = 0; i < many; i++) {
    const licenceEntity = buildLicenceEntity(region)

    // Without this, both the licence and its charge version only cover the last year or so (their default start
    // dates), so there's nothing for a supplementary bill run to pick up in earlier sroc periods
    licenceEntity.licence.startDate = srocStartDate
    licenceEntity.licenceVersion.startDate = srocStartDate
    licenceEntity.licenceDocument.startDate = srocStartDate
    licenceEntity.licenceDocumentRole.startDate = srocStartDate

    const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
    const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)

    const billEntities = billRunPeriods.map(({ billRun, period }) => {
      return buildBillEntity(billRun, licenceEntity, billingAccountEntity, chargeVersionEntity, period, region)
    })

    licences.push(mergeByKey(licenceEntity, billingAccountEntity, chargeVersionEntity, ...billEntities))
  }

  return licences
}

function _updateBillRunTotals(billRuns, bills) {
  for (const billRun of billRuns) {
    const billRunBills = bills.filter((bill) => {
      return bill.billRunId === billRun.id
    })

    billRun.invoiceCount = 0
    billRun.creditNoteCount = 0
    billRun.invoiceValue = 0
    billRun.creditNoteValue = 0
    billRun.netTotal = 0

    for (const bill of billRunBills) {
      if (bill.credit) {
        billRun.creditNoteCount++
      } else {
        billRun.invoiceCount++
      }

      billRun.invoiceValue += bill.invoiceValue
      billRun.creditNoteValue += bill.creditNoteValue
      billRun.netTotal += bill.netAmount
    }
  }
}
