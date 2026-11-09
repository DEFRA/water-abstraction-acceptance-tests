import AbstractionAlertNotificationsPresenter from 'water-abstraction-engine/presenters/notices/setup/abstraction-alert-notifications.presenter.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (session, recipients, notice) {
  const notifications = AbstractionAlertNotificationsPresenter(session, recipients, notice.id)

  return notifications.map((notification) => {
    return {
      id: generateUUID(),
      ...notification,
      createdAt: notice.createdAt
    }
  })
}
