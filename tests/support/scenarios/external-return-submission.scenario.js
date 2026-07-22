import registeredLicenceWithOpenWinterReturnLog from './registered-licence-with-open-winter-return-log.scenario.js'

export const title = 'External return submission'
export const description =
  'Registered licence with an open return log for testing the external return submission journey'

export default function (calculatedDates) {
  const licence = registeredLicenceWithOpenWinterReturnLog(calculatedDates)

  // The external return submission journey validates the region digit in the return ID against `v1:[1-8]:...`, so we
  // override the '9' our data builders default to for this scenario only, rather than changing it for every consumer.
  licence.returnLogs[0].returnId = licence.returnLogs[0].returnId.replace('v1:9:', 'v1:1:')

  return licence
}
