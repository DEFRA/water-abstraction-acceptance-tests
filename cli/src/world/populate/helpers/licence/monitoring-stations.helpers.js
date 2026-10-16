import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { addCondition } from './conditions.helpers.js'
import { currentPurpose } from './purposes.helpers.js'
import licenceMonitoringStationData from '../../../../../../tests/support/data/licence-monitoring-station.data.js'
import { formatDateToIso, relativeToToday } from '../../../../../../tests/support/helpers/date.helpers.js'

// The cessation condition a tag is linked to, by what the tag measures
const CONDITION_TYPES = {
  flow: 'Flow cessation condition',
  level: 'Level cessation condition'
}

/**
 * Tag a licence to a monitoring station
 *
 * The tag has the abstraction period of the first purpose on the licence's current licence version. Where it is linked
 * to a condition, a cessation condition for what it measures is added to the licence for it. Where its last alert was
 * not a resume alert, it was sent 7 days ago.
 *
 * Call this after the licence's abstraction period has been set. Call it again to tag the licence again.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} monitoringStation - the monitoring station to tag the licence to
 * @param {object} tag - the tag, for example
 * `{ measureType: 'flow', restrictionType: 'stop', thresholdUnit: 'Ml/d', thresholdValue: 83.8, linkedCondition: true,
 * status: 'stop' }`
 */
export function tagToMonitoringStation(licenceEntity, monitoringStation, tag) {
  // A licence is built with no tags. The first time this is called the list is created
  licenceEntity.licenceMonitoringStations ??= []

  const purpose = currentPurpose(licenceEntity)
  const licenceMonitoringStation = licenceMonitoringStationData(licenceEntity.licence, monitoringStation)

  licenceMonitoringStation.measureType = tag.measureType
  licenceMonitoringStation.restrictionType = tag.restrictionType
  licenceMonitoringStation.thresholdUnit = tag.thresholdUnit
  licenceMonitoringStation.thresholdValue = tag.thresholdValue
  licenceMonitoringStation.abstractionPeriodStartDay = purpose.abstractionPeriodStartDay
  licenceMonitoringStation.abstractionPeriodStartMonth = purpose.abstractionPeriodStartMonth
  licenceMonitoringStation.abstractionPeriodEndDay = purpose.abstractionPeriodEndDay
  licenceMonitoringStation.abstractionPeriodEndMonth = purpose.abstractionPeriodEndMonth
  licenceMonitoringStation.status = tag.status

  if (tag.status !== 'resume') {
    licenceMonitoringStation.statusUpdatedAt = formatDateToIso(relativeToToday(-7))
  }

  if (tag.linkedCondition) {
    addCondition(licenceEntity)

    const condition = licenceEntity.licenceVersionPurposeConditions.at(-1)

    // A condition is built without an id, so it is given one for the tag to link to
    condition.id = generateUUID()
    condition.licenceVersionPurposeConditionTypeId.lookup = 'displayTitle'
    condition.licenceVersionPurposeConditionTypeId.value = CONDITION_TYPES[tag.measureType]

    licenceMonitoringStation.licenceVersionPurposeConditionId = condition.id
  }

  licenceEntity.licenceMonitoringStations.push(licenceMonitoringStation)
}
