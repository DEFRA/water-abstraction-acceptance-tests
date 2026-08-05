import billRunData from '../data/bill-run.data.js'
import { today } from '../helpers/date.helpers.js'
import buildChargeVersionEntity from './charge-version.entity.js'

/**
 * Builds a bill run in its entirety: a charge version for the given licence, and a sent bill run for the financial
 * year ending taken from the given billing period dates — the minimum valid data a bill run needs to exist against
 * a licence.
 *
 * The bill run's batch type is left at the data file's default (annual). Scenarios needing a different batch type
 * must set `billRun.batchType` themselves.
 */
export default function (licenceEntity, twoPartTariffDates) {
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  const billRun = billRunData()

  billRun.createdAt = today()
  billRun.fromFinancialYearEnding = new Date(twoPartTariffDates.endDate).getUTCFullYear()
  billRun.toFinancialYearEnding = new Date(twoPartTariffDates.endDate).getUTCFullYear()

  return {
    ...chargeVersionEntity,
    billRun
  }
}
