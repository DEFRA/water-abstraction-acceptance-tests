import { holdBySameCompany } from './helpers/holders.helpers.js'
import { REGIONS, regionOf } from './helpers/regions.helpers.js'

// How often a licence is held by a water company. Every 24th licence in a region is, starting with its first.
// This is just an arbitrary way of adding multiple licences to a water company.
const WATER_COMPANY_EVERY = 24

/**
 * Hold some of the licences by water companies
 *
 * Every 24th licence in a region is held by a water company, starting with the region's first. A region's water company
 * licences are all held by the same company: the current licence holder of the first of them.
 *
 * @param {object[]} licenceEntities - the licence entities to change
 */
export default function waterCompanies(licenceEntities) {
  for (const { region } of REGIONS) {
    const regionLicenceEntities = licenceEntities.filter((licenceEntity) => {
      return regionOf(licenceEntity).region === region
    })

    const waterCompanyLicenceEntities = []

    for (let i = 0; i < regionLicenceEntities.length; i += WATER_COMPANY_EVERY) {
      waterCompanyLicenceEntities.push(_heldByWaterCompany(regionLicenceEntities[i]))
    }

    holdBySameCompany(waterCompanyLicenceEntities)
  }
}

/**
 * Flag a licence as held by a water company
 *
 * @private
 */
function _heldByWaterCompany(licenceEntity) {
  licenceEntity.licence.waterUndertaker = true

  return licenceEntity
}
