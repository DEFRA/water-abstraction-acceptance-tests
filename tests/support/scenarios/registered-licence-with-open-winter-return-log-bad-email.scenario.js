import registeredLicenceWithOpenWinterReturnLogScenario from './registered-licence-with-open-winter-return-log.scenario.js'

export const title = 'Registered licence with an open return log and bad primary user (winter cycle)'
export const description =
  "Registered licence linked to a 'bad' external user, with one return requirement and an open return log for the previous winter cycle to test the triggering of alternate notices"

export default function (calculatedDates) {
  const registeredLicenceWithOpenWinterReturnLog = registeredLicenceWithOpenWinterReturnLogScenario(calculatedDates)

  const {
    addresses: [address],
    licenceEntities: [licenceEntity]
  } = registeredLicenceWithOpenWinterReturnLog

  // We'll only set the due date on the OPEN return log if the alternate notification is successful. The Notify
  // service will reject the request if the address is not real, even though we're using our Notify test API key.
  // This is why we override the address record that will be linked to the licence's licence holder.
  address.address1 = 'HORIZON HOUSE'
  address.address2 = 'DEANERY ROAD'
  address.address3 = null
  address.address4 = null
  address.address5 = null
  address.address6 = null
  address.postcode = 'BS1 5AH'

  licenceEntity.name = 'iwill-fail@e'

  // We'll only set the due date on the OPEN return log if the alternate notification is successful, so it must
  // start out unset.
  registeredLicenceWithOpenWinterReturnLog.returnLogs[0].dueDate = null

  return registeredLicenceWithOpenWinterReturnLog
}
