import CreateNoticePresenter from 'water-abstraction-engine/presenters/notices/setup/create-notice.presenter.js'
import { NoticeTypes } from 'water-abstraction-engine/lib/static-lookups.lib.js'
import { faker } from 'water-abstraction-engine/test/faker.js'
import { generateGovUKEmail, generateUUID } from 'water-abstraction-engine/test/generators.js'

// The characters the service makes a notice's reference code from
const REFERENCE_CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRTUVWXYZ0123456789'

export default function (session, recipients, createdAt) {
  const noticeId = generateUUID()

  const { name, prefix, subType } = NoticeTypes[session.noticeType]
  const referenceCode = `${prefix}${faker.string.fromCharacters(REFERENCE_CODE_CHARACTERS, 6)}`

  const notice = CreateNoticePresenter({ ...session, name, referenceCode, subType }, recipients, generateGovUKEmail())

  return {
    id: noticeId,
    ...notice,
    createdAt,
    updatedAt: createdAt
  }
}
