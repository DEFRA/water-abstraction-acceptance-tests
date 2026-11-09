import { generateExternalEmailAddress } from 'water-abstraction-engine/test/generators.js'
import monitoringStationHelper from 'water-abstraction-engine/test/helpers/monitoring-station.helper.js'
import { NoticeJourney, NoticeType } from 'water-abstraction-engine/lib/static-lookups.lib.js'

import abstractionAlertNotificationsData from '../../../../tests/support/data/abstraction-alert-notifications.data.js'
import noticeData from '../../../../tests/support/data/notice.data.js'
import returnsNoticeNotificationsData from '../../../../tests/support/data/returns-notice-notifications.data.js'
import { formatDateToIso, relativeToToday, today } from '../../../../tests/support/helpers/date.helpers.js'

const ContactType = Object.freeze({
  ADDITIONAL_CONTACT: 'additional contact',
  LICENCE_HOLDER: 'licence holder',
  PRIMARY_USER: 'primary user',
  RETURNS_TO: 'returns to',
  SINGLE_USE: 'single use'
})

// The contacts that are sent a letter. All the rest are emailed.
const LETTER_CONTACTS = [ContactType.LICENCE_HOLDER, ContactType.RETURNS_TO, ContactType.SINGLE_USE]

/**
 * Add a few notices of each kind so they can be seen on the notices page
 *
 * Each returns notice is for the next licences with an ended return log made in the service, and each alert for the
 * licences tagged to one of the first monitoring stations licences are tagged to. Every 50th email errors and every
 * 25th letter is returned, counted across all the notices. Return logs and tags are left as they are.
 *
 * @param {object[]} licenceEntities - the licence entities to add notices to
 */
export default function notices(licenceEntities) {
  const { ADHOC, STANDARD } = NoticeJourney
  const { INVITATIONS, REMINDERS } = NoticeType

  const RETURNS_NOTICES = [
    { daysAgo: 40, journey: STANDARD, licences: 70, noticeType: INVITATIONS },
    { daysAgo: 20, journey: STANDARD, licences: 60, noticeType: REMINDERS },
    { contactType: ContactType.PRIMARY_USER, daysAgo: 10, journey: ADHOC, licences: 1, noticeType: INVITATIONS },
    { contactType: ContactType.SINGLE_USE, daysAgo: 5, journey: ADHOC, licences: 1, noticeType: INVITATIONS }
  ]

  // An alert is sent for each of this many monitoring stations, taking the alert types in turn
  const ALERT_STATIONS = 10
  const ALERT_TYPES = ['warning', 'reduce', 'stop', 'resume']

  const byLicenceRef = new Map()
  const sent = { contacts: 0, email: 0, letter: 0 }

  for (const licenceEntity of licenceEntities) {
    licenceEntity.events = []
    licenceEntity.notifications = []
    byLicenceRef.set(licenceEntity.licence.licenceRef, licenceEntity)
  }

  const withServiceReturnLogs = licenceEntities.filter((licenceEntity) => {
    return _serviceReturnLog(licenceEntity)
  })

  let next = 0

  for (const example of RETURNS_NOTICES) {
    const forLicences = withServiceReturnLogs.slice(next, next + example.licences)

    if (forLicences.length < example.licences) {
      throw new Error(`Not enough licences with ended service return logs for ${example.licences} licences`)
    }

    _returnsNotice(example, forLicences, licenceEntities, byLicenceRef, sent)
    next += example.licences
  }

  const monitoringStationIds = _taggedMonitoringStationIds(licenceEntities).slice(0, ALERT_STATIONS)

  if (monitoringStationIds.length < ALERT_STATIONS) {
    throw new Error(`Not enough monitoring stations with tagged licences for ${ALERT_STATIONS} alerts`)
  }

  monitoringStationIds.forEach((monitoringStationId, index) => {
    const example = { alertType: ALERT_TYPES[index % ALERT_TYPES.length], daysAgo: 4 * (index + 1) }

    _alert(example, monitoringStationId, licenceEntities, byLicenceRef, sent)
  })
}

/**
 * Give a notice's notifications their status, then the notice its counts and overall status, as the service does
 *
 * Every 50th email errors and every 25th letter is returned, counted across all the notices. The notice is added to the
 * licence of its first notification, and each notification to the licence it is for.
 *
 * @private
 */
function _addNotice(notice, notifications, byLicenceRef, sent) {
  // How often a message fails, the status it is given when it does, and what Notify says for each status
  const FAILURES = {
    email: { every: 50, failed: 'error', notifyStatuses: { error: 'permanent-failure', sent: 'delivered' } },
    letter: { every: 25, failed: 'returned', notifyStatuses: { returned: 'received', sent: 'received' } }
  }

  const statusCounts = { cancelled: 0, error: 0, pending: 0, returned: 0, sent: 0 }

  for (const notification of notifications) {
    const { every, failed, notifyStatuses } = FAILURES[notification.messageType]

    sent[notification.messageType]++

    const status = sent[notification.messageType] % every === 0 ? failed : 'sent'

    notification.status = status
    notification.notifyStatus = notifyStatuses[status]

    if (status === 'returned') {
      notification.returnedAt = notification.createdAt
    }

    statusCounts[status]++
    byLicenceRef.get(notification.licences[0]).notifications.push(notification)
  }

  notice.statusCounts = statusCounts
  notice.metadata.error = statusCounts.error
  notice.overallStatus = _overallStatus(statusCounts)

  byLicenceRef.get(notifications[0].licences[0]).events.push(notice)
}

/**
 * Add an abstraction alert for a monitoring station's tags, sent to one contact for each tagged licence
 *
 * The contacts are taken in turn, counted across all the alerts: mostly additional contacts and primary users, and now
 * and then a letter to the licence holder.
 *
 * @private
 */
function _alert(example, monitoringStationId, licenceEntities, byLicenceRef, sent) {
  const ALERT_CONTACTS = [
    ContactType.ADDITIONAL_CONTACT,
    ContactType.PRIMARY_USER,
    ContactType.ADDITIONAL_CONTACT,
    ContactType.PRIMARY_USER,
    ContactType.ADDITIONAL_CONTACT,
    ContactType.ADDITIONAL_CONTACT,
    ContactType.PRIMARY_USER,
    ContactType.ADDITIONAL_CONTACT,
    ContactType.ADDITIONAL_CONTACT,
    ContactType.LICENCE_HOLDER
  ]

  const { alertType, daysAgo } = example
  const date = formatDateToIso(relativeToToday(-daysAgo))
  const { label, riverName } = monitoringStationHelper.data.find((station) => {
    return station.id === monitoringStationId
  })

  const tagged = licenceEntities.filter((licenceEntity) => {
    return licenceEntity.licenceMonitoringStations?.some((tag) => {
      return tag.monitoringStationId === monitoringStationId
    })
  })

  const recipients = tagged.map((licenceEntity) => {
    const contactType = ALERT_CONTACTS[sent.contacts % ALERT_CONTACTS.length]

    sent.contacts++

    return _recipient(licenceEntity, contactType, licenceEntities)
  })

  const session = {
    alertType,
    journey: NoticeJourney.ALERTS,
    monitoringStationId,
    noticeType: NoticeType.ABSTRACTION_ALERTS
  }
  const notice = noticeData(session, recipients, date)

  session.alertEmailAddress = notice.issuer
  session.monitoringStationName = label
  session.monitoringStationRiverName = riverName
  session.relevantLicenceMonitoringStations = tagged.flatMap(({ licence, licenceMonitoringStations }) => {
    return licenceMonitoringStations
      .filter((tag) => {
        return tag.monitoringStationId === monitoringStationId
      })
      .map((tag) => {
        return { ...tag, licence: { id: licence.id, licenceRef: licence.licenceRef }, notes: null }
      })
  })

  const notifications = abstractionAlertNotificationsData(session, recipients, notice)

  _addNotice(notice, notifications, byLicenceRef, sent)
}

/**
 * The licence's current holder as a letter contact, in the shape the service fetches it
 *
 * The holder's company and address can be on any of the licence entities, as licences share them.
 *
 * @private
 */
function _contact(licenceEntity, licenceEntities) {
  const { addressId, companyId } = licenceEntity.licenceVersions.at(-1)

  const company = licenceEntities
    .flatMap((entity) => {
      return entity.companies
    })
    .find((company) => {
      return company.id === companyId
    })

  const address = licenceEntities
    .flatMap((entity) => {
      return entity.addresses
    })
    .find((address) => {
      return address.id === addressId
    })

  if (!company || !address) {
    throw new Error(`No current holder company and address found for licence ${licenceEntity.licence.licenceRef}`)
  }

  const { address1, address2, address3, address4, country, postcode } = address

  return {
    address1,
    address2,
    address3,
    address4,
    address5: null,
    address6: null,
    country,
    name: company.name,
    postcode
  }
}

/**
 * A notice's overall status from its status counts, in the service's order
 *
 * @private
 */
function _overallStatus(statusCounts) {
  if (statusCounts.returned > 0) {
    return 'returned'
  }

  if (statusCounts.error > 0) {
    return 'error'
  }

  return 'sent'
}

/**
 * A recipient for a licence's contact, emailed or sent a letter by its contact type, in the shape the service fetches it
 *
 * @private
 */
function _recipient(licenceEntity, contactType, licenceEntities) {
  const letter = LETTER_CONTACTS.includes(contactType)

  return {
    contact: letter ? _contact(licenceEntity, licenceEntities) : null,
    contact_type: contactType,
    email: letter ? null : generateExternalEmailAddress(),
    licence_refs: [licenceEntity.licence.licenceRef],
    message_type: letter ? 'Letter' : 'Email'
  }
}

/**
 * The contacts a licence's standard returns notice goes to, by where it is in the notice
 *
 * Most go to the primary user and every 6th to the licence holder instead. Every 25th also goes to a returns to
 * contact.
 *
 * @private
 */
function _returnsContacts(index) {
  const RETURNS_CONTACTS = [
    ContactType.PRIMARY_USER,
    ContactType.PRIMARY_USER,
    ContactType.PRIMARY_USER,
    ContactType.PRIMARY_USER,
    ContactType.PRIMARY_USER,
    ContactType.LICENCE_HOLDER
  ]
  const RETURNS_TO_EVERY = 25

  const contacts = [RETURNS_CONTACTS[index % RETURNS_CONTACTS.length]]

  if (index % RETURNS_TO_EVERY === RETURNS_TO_EVERY - 1) {
    contacts.push(ContactType.RETURNS_TO)
  }

  return contacts
}

/**
 * Add a returns invitation or reminder for licences' ended return logs made in the service
 *
 * An ad-hoc notice goes to the contact type of its example, and a standard one to each licence's returns contacts. The
 * notice's period is the first licence's return log's.
 *
 * @private
 */
function _returnsNotice(example, forLicences, licenceEntities, byLicenceRef, sent) {
  const { contactType, daysAgo, journey, noticeType } = example
  const date = formatDateToIso(relativeToToday(-daysAgo))

  const session = { journey, noticeType }

  if (journey === NoticeJourney.STANDARD) {
    const { dueDate, endDate, metadata, startDate } = _serviceReturnLog(forLicences[0])

    session.determinedReturnsPeriod = { dueDate, endDate, startDate, summer: String(metadata.isSummer) }
  }

  const recipients = forLicences.flatMap((licenceEntity, index) => {
    const returnLog = _serviceReturnLog(licenceEntity)
    const contactTypes = journey === NoticeJourney.ADHOC ? [contactType] : _returnsContacts(index)

    return contactTypes.map((licenceContactType) => {
      return {
        ..._recipient(licenceEntity, licenceContactType, licenceEntities),
        notificationDueDate: returnLog.dueDate,
        return_log_ids: [returnLog.id]
      }
    })
  })

  const notice = noticeData(session, recipients, date)
  const notifications = returnsNoticeNotificationsData(session, recipients, notice)

  _addNotice(notice, notifications, byLicenceRef, sent)
}

/**
 * A licence's first return log made in the service that has ended and been given a due date, if it has one
 *
 * @private
 */
function _serviceReturnLog(licenceEntity) {
  const todayDate = formatDateToIso(today())

  return licenceEntity.returnLogs.find((returnLog) => {
    return (
      returnLog.source !== 'NALD' && returnLog.status !== 'void' && returnLog.endDate < todayDate && returnLog.dueDate
    )
  })
}

/**
 * The monitoring stations licences are tagged to, in the order they are first found
 *
 * @private
 */
function _taggedMonitoringStationIds(licenceEntities) {
  const monitoringStationIds = licenceEntities.flatMap((licenceEntity) => {
    return (licenceEntity.licenceMonitoringStations ?? []).map((tag) => {
      return tag.monitoringStationId
    })
  })

  return [...new Set(monitoringStationIds)]
}
