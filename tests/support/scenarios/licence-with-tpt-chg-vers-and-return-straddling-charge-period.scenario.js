import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'

export const title = 'Licence with tpt charge version and a return straddling the charge period'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle, with the charge version starting mid-April'

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
