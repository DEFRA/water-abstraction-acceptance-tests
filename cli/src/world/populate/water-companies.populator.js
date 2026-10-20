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

    _holdBySameCompany(waterCompanyLicenceEntities)
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

/**
 * Make the first licence's company the current licence holder of them all
 *
 * A licence is built with its own company and address, and is given another each time it is transferred. Its current
 * licence holder is the last of them. A water company holds many licences, so the rest give up their current licence
 * holder and take the first licence's instead. Any licence holders a licence had before that are left as they were.
 *
 * @private
 */
function _holdBySameCompany(licenceEntities) {
  const [firstLicenceEntity, ...otherLicenceEntities] = licenceEntities
  const { address, company } = _currentHolder(firstLicenceEntity)

  for (const licenceEntity of otherLicenceEntities) {
    const droppedCompany = _dropCurrentHolder(licenceEntity)

    const licenceVersions = licenceEntity.licenceVersions
    const licenceDocumentRoles = licenceEntity.licenceDocumentRoles

    for (const held of [...licenceVersions, ...licenceDocumentRoles]) {
      if (held.companyId === droppedCompany.id) {
        held.companyId = company.id
        held.addressId = address.id
      }
    }

    licenceEntity.licenceDocumentHeader.metadata.Name = company.name
    licenceEntity.licenceDocumentHeader.metadata.contacts[0].name = company.name
  }
}

/**
 * The company and address of a licence's current licence holder
 *
 * @private
 */
function _currentHolder(licenceEntity) {
  if (licenceEntity.companies) {
    return { company: licenceEntity.companies.at(-1), address: licenceEntity.addresses.at(-1) }
  }

  return { company: licenceEntity.company, address: licenceEntity.address }
}

/**
 * Remove a licence's current licence holder, with its address, and return the company
 *
 * @private
 */
function _dropCurrentHolder(licenceEntity) {
  if (licenceEntity.companies) {
    licenceEntity.addresses.pop()
    licenceEntity.companyAddresses.pop()

    return licenceEntity.companies.pop()
  }

  const { company } = licenceEntity

  delete licenceEntity.company
  delete licenceEntity.address
  delete licenceEntity.companyAddress

  return company
}
