import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (licence) {
  const licenceDocumentHeaderId = generateUUID()

  return {
    id: licenceDocumentHeaderId,
    regimeEntityId: {
      schema: 'public',
      table: 'licenceEntities',
      lookup: 'type',
      value: 'regime',
      select: 'id'
    },
    licenceRef: licence.licenceRef,
    naldId: {
      schema: 'public',
      table: 'permitLicences',
      lookup: 'licenceRef',
      value: licence.licenceRef,
      select: 'id'
    },
    metadata: {
      Name: 'cupcake factory',
      dataType: 'acceptance-test-setup',
      IsCurrent: true,
      Salutation: '',
      AddressLine1: 'Big Farm',
      AddressLine2: 'Windy road',
      AddressLine3: 'Buttercup meadow',
      AddressLine4: 'Buttercup Village',
      Town: 'Testington',
      County: 'Testingshire',
      Postcode: 'TT1 1TT',
      Country: 'United Kingdom',
      contacts: [
        {
          name: 'Environment Agency',
          role: 'Licence holder',
          town: 'Bristol',
          type: 'Organisation',
          county: null,
          country: null,
          forename: null,
          initials: null,
          postcode: 'BS1 5AH',
          salutation: null,
          addressLine1: 'Horizon House',
          addressLine2: 'Dean Lane',
          addressLine3: null,
          addressLine4: null
        }
      ]
    },
    licence_name: 'the daily cupcake licence'
  }
}
