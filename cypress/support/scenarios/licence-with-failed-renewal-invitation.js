import licenceData from '../fixture-builder/licence.js'
import returnLogs from '../fixture-builder/return-logs.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnVersion from '../fixture-builder/return-version.js'
import usersData from '../fixture-builder/users.js'
import users from '../../fixtures/users.json' with { type: "json" }
import { compareDates, formatDateToIso, previousPeriod, relativeToToday, today } from '../helpers/date.helpers.js'

export default function (currentServiceData) {
  const { firstReturnPeriod } = currentServiceData

  let returnPeriod = firstReturnPeriod

  // If the first return period ends in the future, we won't be able to interact with it. This scenario was written
  // for a number of our return log tests, that check we can add various types of return submissions.
  // To ensure we can interact with the return log, we bump the period back by one, so it ends in the past.
  if (!compareDates(firstReturnPeriod.endDate, today())) {
    returnPeriod = previousPeriod(firstReturnPeriod)
  }

  const endDate = new Date(returnPeriod.endDate)
  const startDate = new Date(returnPeriod.startDate)

  const endDateString = formatDateToIso(endDate)
  const startDateString = formatDateToIso(startDate)

  const dataModel = {
    ...licenceData(),
    ...returnVersion(),
        ...returnRequirements(),
        ...returnLogs(1)
  }

  // We'll only set the due date on the OPEN return log if the alternate notification is successful. The Notify service
  // will reject the request if the address is not real, even though we're using our Notify test API key. This is why
  // we update the address record that will be linked to the licence's licence holder.
  dataModel.addresses = [
    {
      id: '62549cdb-073f-4d5c-a2a1-c47b0b910010',
      address1: 'HORIZON HOUSE',
      address2: 'DEANERY ROAD',
      postcode: 'BS1 5AH',
      country: 'UK',
      dataSource: 'nald'
    }
  ]

  // For the licence to be flagged as registered, we have to link the 'bad' user record to the licence via the licence
  // entity record. For completeness, we also ensure the entity name matches our 'bad' user's username, but this is not
  // essential for the licence to be registered.
  const primaryUser = usersData().externalBad
  primaryUser.licenceEntityId = dataModel.licenceEntities[0].id
  dataModel.licenceEntities[0].name = primaryUser.username

  dataModel.users = [primaryUser]

  dataModel.returnLogs[0].dueDate = null
  dataModel.returnLogs[0].endDate = endDateString
  dataModel.returnLogs[0].id = '7f6ff22b-f7f6-4f37-a29e-244fad5a22eb'
  dataModel.returnLogs[0].metadata.description = dataModel.returnRequirements[0].siteDescription
  dataModel.returnLogs[0].metadata.isSummer = dataModel.returnRequirements[0].summer
  dataModel.returnLogs[0].returnCycleId.value = `${startDate.getFullYear()}-04-01`
  dataModel.returnLogs[0].returnId = `v1:8:AT/TE/ST/01/01:9999990:${startDateString}:${endDateString}`
  dataModel.returnLogs[0].returnReference = dataModel.returnRequirements[0].legacyId
  dataModel.returnLogs[0].returnRequirementId = dataModel.returnRequirements[0].id
  dataModel.returnLogs[0].startDate = startDateString
  dataModel.returnLogs[0].status = 'due'
  dataModel.returnLogs[0].quarterly = returnPeriod.quarterly

  // The expired date needs to be more than 90 days in the future for the licence to be eligible for a renewal invitation.
  const expiredDate = new Date()
  expiredDate.setDate(expiredDate.getDate() + 91)
  dataModel.licences[0].expiredDate = expiredDate.toISOString().split('T')[0]

  const notices = _notices()

  dataModel.events = notices
  dataModel.notifications = _notifications(notices, dataModel.returnLogs[0].id)

  return dataModel
}

function _notifications (notices, returnLogId) {
  return [
    {
      id: 'a818564b-32e1-402d-9db4-94dd66ef1d64',
      recipient: usersData().externalBad.username,
      messageType: 'email',
      messageRef: 'renewal invitation',
      personalisation: { expiryDate: '10 September 2026', licenceRef: 'AT/TE/ST/01/01', renewalDate: '12 June 2026'},
      status: 'pending',
      licences: ['AT/TE/ST/01/01'],
      notifyId: '040622a0-9e75-40c9-9305-77860eecea11',
      plaintext: `Dear licence contact

  Licence AT/TE/ST/01/01 will expire on 10 September 2026.

  # Who needs to submit the renewal application

  The licence holder must submit the renewal application.`,
      eventId: notices[0].id,
      createdAt: new Date(),
      templateId: '53c34f21-4f2e-43f7-97c6-7a7828079665',
      contactType: 'primary user',
      updatedAt: new Date()
    },
    {
      id: '4f73421d-ca18-424e-9b33-561868bdfb35',
      recipient: usersData().externalBad.username,
      messageType: 'email',
      messageRef: 'returns invitation',
      personalisation: {
        periodEndDate: '31 March 2026',
        returnDueDate: '28 April 2026',
        periodStartDate: '1 April 2025'
      },
      dueDate: relativeToToday(29),
      returnLogIds: [returnLogId],
      status: 'pending',
      licences: ['AT/TE/ST/01/01'],
      notifyId: 'ab0f73a6-879b-41d2-ad31-419c94ef4edf',
      plaintext: `Dear licence contact

  Licence AT/TE/ST/01/01 will expire on 10 September 2026.

  ^ You must submit a record of your water abstraction from 1 April 2025 to 31 March 2026.`,
      eventId: notices[1].id,
      createdAt: new Date(),
      templateId: '2fa7fc83-4df1-4f52-bccf-ff0faeb12b6f',
      contactType: 'primary user',
      updatedAt: new Date()
    }
  ]
}

function _notices () {
  return [
    {
      id: '20751b8e-1861-4e84-8290-a11ec854e023',
      referenceCode: 'REIN-B39H2J',
      type: 'notification',
      subtype: 'renewalInvitation',
      issuer: users.psc,
      licences: ['AT/TE/ST/01/01'],
      metadata: {
        name: 'Renewals: invitation', error: 0, expiryDate: '2026-09-10', recipients: 1, renewalDate: '2026-06-12'
      },
      status: 'completed',
      overallStatus: 'pending',
      statusCounts: { sent: 0, error: 0, pending: 1, returned: 0, cancelled: 0},
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'e50033f0-17c1-4100-9241-b5eaf0da75d2',
      referenceCode: 'RINV-S42K8Y',
      type: 'notification',
      subtype: 'returnInvitation',
      issuer: users.psc,
      licences: ['AT/TE/ST/01/01'],
      metadata: {
        name: 'Returns: invitation',
        error: 0,
        expiryDate: '2026-09-10',
        options: { excludeLicences : [] },
        recipients: 1,
        returnCycle: {dueDate: '2026-04-28', endDate: '2026-03-31', isSummer: false, startDate: '2025-04-01' }
      },
      status: 'completed',
      overallStatus: 'pending',
      statusCounts: { sent: 0, error: 0, pending: 1, returned: 0, cancelled: 0},
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}
