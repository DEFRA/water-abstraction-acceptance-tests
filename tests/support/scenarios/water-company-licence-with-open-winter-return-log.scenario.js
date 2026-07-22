import licenceWithOpenWinterReturnLog from './licence-with-open-winter-return-log.scenario.js'

export const title = 'Water company licence with open return log (winter cycle)'
export const description =
  'Water company licence with one non-quarterly return requirement and an open winter return log for the previous winter cycle'

export default function (calculatedDates) {
  const licence = licenceWithOpenWinterReturnLog(calculatedDates)

  licence.licences[0].waterUndertaker = true

  return licence
}
