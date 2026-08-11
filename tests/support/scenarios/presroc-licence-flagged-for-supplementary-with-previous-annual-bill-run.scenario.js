import billRunData from '../data/bill-run.data.js'
import { srocStartDate } from '../default-values.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import { formatDateToIso } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { asArrays } from '../helpers/wire-format.helpers.js'
import presrocLicenceWithChargeVersionScenario from './presroc-licence-with-charge-version.scenario.js'

export const title =
  'Presroc licence flagged for presroc and sroc supplementary billing, and a sent annual bill run for the previous year'
export const description =
  'A presroc licence with both an alcs charge version and a second, sroc charge version scoped to only the first sroc financial year, flagged for both the next presroc and sroc supplementary bill runs, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function (dates) {
  const currentEndYear = new Date(dates.currentFinancialYear.endDate).getUTCFullYear()

  const scenario = presrocLicenceWithChargeVersionScenario()

  // This is what flags the licence for the next presroc and sroc supplementary bill runs — without it, each
  // engine's charge version query excludes the licence entirely
  scenario.licence.includeInPresrocBilling = 'yes'
  scenario.licence.includeInSrocBilling = true

  // The presroc charge version ends the day before the sroc one below begins, reflecting a licence that was
  // properly superseded at the scheme boundary rather than one left open-ended
  const presrocChargeVersionEndDate = new Date(srocStartDate)

  presrocChargeVersionEndDate.setUTCDate(presrocChargeVersionEndDate.getUTCDate() - 1)

  scenario.chargeVersion.endDate = formatDateToIso(presrocChargeVersionEndDate)

  const srocChargeVersionEntity = _srocChargeVersion(
    scenario.company,
    scenario.address,
    scenario.licence,
    scenario.licenceVersionPurpose
  )

  const billRun = billRunData()

  billRun.fromFinancialYearEnding = currentEndYear - 1
  billRun.toFinancialYearEnding = currentEndYear - 1

  return {
    ...mergeByKey(asArrays(scenario), asArrays(srocChargeVersionEntity)),
    billRun
  }
}

/**
 * Builds the sroc charge version that succeeds the presroc licence's alcs one, scoped to only the first sroc
 * financial year — enough to prove the sroc engine also works alongside the presroc engine, without duplicating the
 * full multi-year coverage the dedicated sroc scenario already provides
 *
 * @private
 */
function _srocChargeVersion(company, address, licence, licenceVersionPurpose) {
  const chargeVersionEntity = buildChargeVersionEntity(company, address, licence, licenceVersionPurpose)

  chargeVersionEntity.billingAccount.accountNumber = 'S99999992A'

  // Starts on the sroc scheme's first day rather than inheriting the licence's own (pre-sroc) start date, and uses
  // the change reason a real presroc-to-sroc transition would have, rather than the "New licence" default
  chargeVersionEntity.chargeVersion.startDate = srocStartDate
  chargeVersionEntity.chargeVersion.changeReasonId.value = 'Strategic review of charges (SRoC)'

  // Ends at the close of the first sroc financial year (a year to the day after it started, minus a day)
  const financialYearEndDate = new Date(srocStartDate)

  financialYearEndDate.setUTCFullYear(financialYearEndDate.getUTCFullYear() + 1)
  financialYearEndDate.setUTCDate(financialYearEndDate.getUTCDate() - 1)

  chargeVersionEntity.chargeVersion.endDate = formatDateToIso(financialYearEndDate)

  return chargeVersionEntity
}
