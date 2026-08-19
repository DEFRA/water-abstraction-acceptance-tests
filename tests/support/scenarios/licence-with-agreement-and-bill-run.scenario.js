import buildBillRunEntity from '../entities/bill-run.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import licenceWithAgreementScenario from './licence-with-agreement.scenario.js'

export const title = 'Licence with an agreement and a bill run'
export const description =
  'A licence, licence holder (company), section 127 two-part tariff agreement, and a sent two-part tariff bill run.'

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function () {
  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffDates]
    }
  } = calculatedDates()

  const licence = licenceWithAgreementScenario()
  const billRunEntity = buildBillRunEntity(licence, twoPartTariffDates)

  billRunEntity.billRun.batchType = 'two_part_tariff'

  return {
    ...licence,
    ...billRunEntity
  }
}
