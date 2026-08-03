import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'

export const title = 'Licence with tpt charge version starting mid-month and a return straddling the charge period'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle, where the charge version starts mid-April so the charge period begins mid-month and the return whole-month April line spans it, flagging an overlap of charge dates issue'

export default function (calculatedDates) {
  const licence = licenceWithTptChargeVersionAndCompletedReturnLogScenario(calculatedDates)

  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffPeriod]
    }
  } = calculatedDates

  const chargePeriodStartYear = new Date(twoPartTariffPeriod.startDate).getFullYear()

  const {
    chargeVersions: [chargeVersion]
  } = licence

  // Start the charge version mid-April so the charge period begins mid-month; the return's whole-month April line then
  // spans the charge period start, flagging an overlap of charge dates issue
  chargeVersion.startDate = `${chargePeriodStartYear}-04-15`

  return licence
}
