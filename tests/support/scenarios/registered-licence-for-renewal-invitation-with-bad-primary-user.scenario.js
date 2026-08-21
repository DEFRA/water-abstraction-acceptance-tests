import registeredLicenceForRenewalInvitation from './registered-licence-for-renewal-invitation.scenario.js'

export const title = 'Registered licence for renewal invitation with a bad primary user'
export const description =
  "Registered licence eligible for a renewal invitation, linked to a 'bad' external user, to test the triggering of alternate notices"

export default function () {
  const licence = registeredLicenceForRenewalInvitation()

  const { address } = licence
  const [licenceEntity] = licence.licenceEntities

  // The Notify service will reject a request to a fake address even with our Notify test API key, so we override the
  // address record linked to the licence's licence holder to ensure the alternate letter notification can succeed.
  address.address1 = 'HORIZON HOUSE'
  address.address2 = 'DEANERY ROAD'
  address.address3 = null
  address.address4 = null
  address.address5 = null
  address.address6 = null
  address.postcode = 'BS1 5AH'

  licenceEntity.name = 'iwill-fail@e'

  return licence
}
