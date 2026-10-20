/**
 * Make the first licence's company the current licence holder of them all
 *
 * A licence is built with its own company and address, and is given another each time it is transferred. Its current
 * licence holder is the last of them. A company can hold many licences, so the rest give up their current licence
 * holder and take the first licence's instead. Any licence holders a licence had before that are left as they were.
 *
 * @param {object[]} licenceEntities - the licence entities to be held by the same company
 */
export function holdBySameCompany(licenceEntities) {
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
 * A licence that only had the one is left with empty lists, so a transfer later can add its new licence holder to them.
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

  licenceEntity.companies = []
  licenceEntity.addresses = []
  licenceEntity.companyAddresses = []

  return company
}
