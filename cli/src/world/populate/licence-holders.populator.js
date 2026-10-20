import { holdBySameCompany } from './helpers/holders.helpers.js'
import { REGIONS, regionOf } from './helpers/regions.helpers.js'

/**
 * Hold some licences by a company that holds others
 *
 * Most licence holders hold one licence, some hold a few and a very few hold many. In each region the licences not held
 * by a water company are taken in order and split into groups, each the size of the next number in the list, and each
 * group is held by the same company: the current licence holder of the first licence in it. A group of 1 is left as it
 * is. Groups stay within a region, as a company's licences are all in one region, and the last group in a region is cut
 * short if the region runs out of licences.
 *
 * The list goes back to the start when it runs out, and carries on from where it got to in the next region. Of every
 * 48 numbers, 39 are 1, 8 are from 2 to 5 and 1 is 8.
 *
 * Call this after the water companies have been set, and before the later licence versions, so a licence in a group
 * can still be transferred to another licence holder.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function licenceHolders(licenceEntities) {
  const HOLDINGS = [
    1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1,
    1, 1, 3, 1, 1, 1, 1, 8, 2
  ]

  let holdingIndex = 0

  for (const { region } of REGIONS) {
    const regionLicenceEntities = licenceEntities.filter((licenceEntity) => {
      return regionOf(licenceEntity).region === region && !licenceEntity.licence.waterUndertaker
    })

    let i = 0

    while (i < regionLicenceEntities.length) {
      const holding = HOLDINGS[holdingIndex % HOLDINGS.length]
      const groupLicenceEntities = regionLicenceEntities.slice(i, i + holding)

      if (groupLicenceEntities.length > 1) {
        holdBySameCompany(groupLicenceEntities)
      }

      i += holding
      holdingIndex++
    }
  }
}
