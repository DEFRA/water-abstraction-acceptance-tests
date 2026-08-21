import licenceWithTptChgVersAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'

export const title = 'Licence with a two-part tariff charge version and a completed non-two-part-tariff return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed non-two-part-tariff return log for the previous winter cycle'

export default function () {
  const licence = licenceWithTptChgVersAndCompletedReturnLogScenario()

  const {
    returnLogs: [previousReturnLog, currentReturnLog],
    returnRequirement
  } = licence

  previousReturnLog.metadata.isTwoPartTariff = false
  currentReturnLog.metadata.isTwoPartTariff = false

  returnRequirement.twoPartTariff = false

  return licence
}
