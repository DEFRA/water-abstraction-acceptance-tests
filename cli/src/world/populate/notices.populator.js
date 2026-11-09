import { generateExternalEmailAddress } from 'water-abstraction-engine/test/generators.js'
import monitoringStationHelper from 'water-abstraction-engine/test/helpers/monitoring-station.helper.js'
import { NoticeJourney, NoticeType } from 'water-abstraction-engine/lib/static-lookups.lib.js'

import abstractionAlertNotificationsData from '../../../../tests/support/data/abstraction-alert-notifications.data.js'
import noticeData from '../../../../tests/support/data/notice.data.js'
import returnsNoticeNotificationsData from '../../../../tests/support/data/returns-notice-notifications.data.js'
import { formatDateToIso, relativeToToday, today } from '../../../../tests/support/helpers/date.helpers.js'

const AlertType = Object.freeze({ REDUCE: 'reduce', RESUME: 'resume', STOP: 'stop', WARNING: 'warning' })

const ContactType = Object.freeze({
  LICENCE_HOLDER: 'licence holder',
  PRIMARY_USER: 'primary user',
  SINGLE_USE: 'single use'
})

/**
 * Add a few notices of each kind, each for many licences, so they can be seen on the notices page
 *
 * Each returns notice is for the next licences with an ended return log made in the service, and each alert for the
 * licences tagged to the first tagged licence's monitoring station. Where an example has a `failed` status, every
 * `every`th of its notifications has it and the rest were sent. Return logs and tags are left as they are.
 *
 * @param {object[]} licenceEntities - the licence entities to add notices to
 */
export default function notices(licenceEntities) {
  const { ADHOC, STANDARD } = NoticeJourney
  const { INVITATIONS, REMINDERS } = NoticeType
  const { LICENCE_HOLDER, PRIMARY_USER, SINGLE_USE } = ContactType

  const RETURNS_NOTICES = [
    {
      contactType: PRIMARY_USER,
      daysAgo: 40,
      every: 10,
      failed: 'error',
      journey: STANDARD,
      licences: 100,
      noticeType: INVITATIONS
    },
    {
      contactType: LICENCE_HOLDER,
      daysAgo: 30,
      every: 10,
      failed: 'returned',
      journey: STANDARD,
      licences: 50,
      noticeType: INVITATIONS
    },
    {
      contactType: PRIMARY_USER,
      daysAgo: 20,
      every: 10,
      failed: 'error',
      journey: STANDARD,
      licences: 50,
      noticeType: REMINDERS
    },
    { contactType: PRIMARY_USER, daysAgo: 10, journey: ADHOC, licences: 1, noticeType: INVITATIONS },
    { contactType: SINGLE_USE, daysAgo: 5, journey: ADHOC, licences: 1, noticeType: INVITATIONS }
  ]

  const ALERTS = [
    { alertType: AlertType.WARNING, daysAgo: 28 },
    { alertType: AlertType.REDUCE, daysAgo: 21 },
    { alertType: AlertType.STOP, daysAgo: 14, every: 3, failed: 'error' },
    { alertType: AlertType.RESUME, daysAgo: 7 }
  ]

  const byLicenceRef = new Map()

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

    _returnsNotice(example, forLicences, licenceEntities, byLicenceRef)
    next += example.licences
  }

  const taggedLicenceEntity = licenceEntities.find((licenceEntity) => {
    return licenceEntity.licenceMonitoringStations?.length > 0
  })

  if (!taggedLicenceEntity) {
    throw new Error('No licence is tagged to a monitoring station to send alerts for')
  }

  const { monitoringStationId } = taggedLicenceEntity.licenceMonitoringStations[0]

  for (const example of ALERTS) {
    _alert(example, monitoringStationId, licenceEntities, byLicenceRef)
  }
}

/**
 * Give a notice's notifications their status, then the notice its counts and overall status, as the service does
 *
 * The notice is added to the licence of its first notification, and each notification to the licence it is for.
 *
 * @private
 */
function _addNotice(example, notice, notifications, byLicenceRef) {
  // What Notify says for each status, by how it was sent
  const NOTIFY_STATUSES = {
    email: { error: 'permanent-failure', sent: 'delivered' },
    letter: { returned: 'received', sent: 'received' }
  }

  const { failed, every } = example
  const statusCounts = { cancelled: 0, error: 0, pending: 0, returned: 0, sent: 0 }

  notifications.forEach((notification, index) => {
    const status = failed && index % every === every - 1 ? failed : 'sent'

    notification.status = status
    notification.notifyStatus = NOTIFY_STATUSES[notification.messageType][status]

    if (status === 'returned') {
      notification.returnedAt = notification.createdAt
    }

    statusCounts[status]++
    byLicenceRef.get(notification.licences[0]).notifications.push(notification)
  })

  notice.statusCounts = statusCounts
  notice.metadata.error = statusCounts.error
  notice.overallStatus = _overallStatus(statusCounts)

  byLicenceRef.get(notifications[0].licences[0]).events.push(notice)
}

/**
 * Add an abstraction alert for a monitoring station's tags, emailed to each tagged licence's primary user
 *
 * @private
 */
function _alert(example, monitoringStationId, licenceEntities, byLicenceRef) {
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

  const recipients = tagged.map(({ licence }) => {
    return {
      contact: null,
      contact_type: ContactType.PRIMARY_USER,
      email: generateExternalEmailAddress(),
      licence_refs: [licence.licenceRef],
      message_type: 'Email'
    }
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

  _addNotice(example, notice, notifications, byLicenceRef)
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
 * Add a returns invitation or reminder for licences' ended return logs made in the service, one recipient each
 *
 * The notice's period is the first licence's return log's.
 *
 * @private
 */
function _returnsNotice(example, forLicences, licenceEntities, byLicenceRef) {
  const { contactType, daysAgo, journey, noticeType } = example
  const date = formatDateToIso(relativeToToday(-daysAgo))
  const letter = contactType !== ContactType.PRIMARY_USER

  const session = { journey, noticeType }

  if (journey === NoticeJourney.STANDARD) {
    const { dueDate, endDate, metadata, startDate } = _serviceReturnLog(forLicences[0])

    session.determinedReturnsPeriod = { dueDate, endDate, startDate, summer: String(metadata.isSummer) }
  }

  const recipients = forLicences.map((licenceEntity) => {
    const returnLog = _serviceReturnLog(licenceEntity)

    return {
      contact: letter ? _contact(licenceEntity, licenceEntities) : null,
      contact_type: contactType,
      email: letter ? null : generateExternalEmailAddress(),
      licence_refs: [licenceEntity.licence.licenceRef],
      message_type: letter ? 'Letter' : 'Email',
      notificationDueDate: returnLog.dueDate,
      return_log_ids: [returnLog.id]
    }
  })

  const notice = noticeData(session, recipients, date)
  const notifications = returnsNoticeNotificationsData(session, recipients, notice)

  _addNotice(example, notice, notifications, byLicenceRef)
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
