import unregisteredLicenceWithOpenWinterReturnLog from './unregistered-licence-with-open-winter-return-log.scenario.js'

export const title = 'Water company licence with open return log (winter cycle)'
export const description =
  'Unregistered water company licence with one non-quarterly return requirement and an open winter return log for the previous winter cycle'

export default function (calculatedDates) {
  const unregisteredLicence = unregisteredLicenceWithOpenWinterReturnLog(calculatedDates)

  unregisteredLicence.licences[0].waterUndertaker = true

  return unregisteredLicence
}
