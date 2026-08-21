import registeredLicenceWithOpenWinterReturnLogScenario from './registered-licence-with-open-winter-return-log.scenario.js'

export const title = 'Registered licence with an open return log and a bad email (winter cycle)'
export const description =
  "Registered licence linked to a 'bad' external user, with one return requirement and an open return log for the previous winter cycle to test the triggering of alternate notices"

export default function () {
  const registeredLicenceWithOpenWinterReturnLog = registeredLicenceWithOpenWinterReturnLogScenario()

  const [licenceEntity] = registeredLicenceWithOpenWinterReturnLog.licenceEntities

  licenceEntity.name = 'iwill-fail@e'

  // We'll only set the due date on the OPEN return log if the alternate notification is successful, so it must
  // start out unset.
  registeredLicenceWithOpenWinterReturnLog.returnLogs[0].dueDate = null

  return registeredLicenceWithOpenWinterReturnLog
}
