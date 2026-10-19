import { correctOn, transferOn } from './helpers/licence-versions.helpers.js'
import { licenceModel } from './helpers/end-dates.helpers.js'
import { regionOf } from './helpers/regions.helpers.js'

// The dates the later licence versions start on. Each licence takes the next one, going back to the start of the list
// when it runs out.
//
// Later changes are more common than earlier ones, so the later years are in the list more than once.
const CHANGE_DATES = ['2023-04-01', '2024-04-01', '2024-04-01', '2025-04-01', '2025-04-01', '2026-04-01']

// Why the licence version changed. Each licence takes the next one, going back to the start of the list when it runs
// out.
//
// Transfers and corrections are seen about as often as each other.
const CHANGES = [transferOn, correctOn]

// How often a live licence is given a licence version after the sroc start date. Every 5th is, starting with the 5th.
//
// A few live licences have changed since sroc started.
const LATER_VERSION_EVERY = 5

/**
 * Give some live licences a licence version after the sroc start date
 *
 * Every 5th live licence that is not held by a water company is transferred to a new licence holder, or corrected, on
 * the next date in the list. A water company's licences are left alone, as they are all held by the same company. A
 * licence whose current version starts on or after the date is skipped, and the date waits for the next licence.
 *
 * Call this after the water companies have been set, and before the abstraction details and charging, so they cover the
 * new licence versions.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function laterLicenceVersions(licenceEntities) {
  const liveLicenceEntities = licenceEntities.filter((licenceEntity) => {
    return !licenceModel(licenceEntity).$ended() && !licenceEntity.licence.waterUndertaker
  })

  let changeCount = 0

  for (let i = LATER_VERSION_EVERY - 1; i < liveLicenceEntities.length; i += LATER_VERSION_EVERY) {
    const licenceEntity = liveLicenceEntities[i]
    const licenceVersions = licenceEntity.licenceVersions ?? [licenceEntity.licenceVersion]
    const changeDate = CHANGE_DATES[changeCount % CHANGE_DATES.length]

    if (licenceVersions.at(-1).startDate >= changeDate) {
      continue
    }

    CHANGES[changeCount % CHANGES.length](licenceEntity, regionOf(licenceEntity).region, changeDate)
    changeCount++
  }
}
