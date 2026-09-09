import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import licenceWithTptChgVersAndDueReturnLogScenario from './licence-with-tpt-chg-vers-and-due-return-log.scenario.js'
import { regions } from '../default-values.js'

export const title = 'Licence with a two-part tariff charge version and a completed return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  const licence = licenceWithTptChgVersAndDueReturnLogScenario(region)

  const {
    returnLogs: [previousReturnLog]
  } = licence

  previousReturnLog.status = 'completed'

  const totalVolume = licence.licenceVersionPurpose.annualQuantity

  const returnSubmissionEntity = buildReturnSubmissionEntity(previousReturnLog, totalVolume)

  return {
    ...licence,
    ...returnSubmissionEntity
  }
}
