export default function (licenceDocument, company, address) {
  return {
    licenceDocumentId: licenceDocument.id,
    licenceRoleId: {
      schema: 'public',
      table: 'licenceRoles',
      lookup: 'name',
      value: 'licenceHolder',
      select: 'id'
    },
    startDate: licenceDocument.startDate,
    companyId: company.id,
    addressId: address.id
  }
}
