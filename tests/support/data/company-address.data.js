export default function (company, address) {
  return {
    companyId: company.id,
    addressId: address.id,
    startDate: '2008-04-01',
    licenceRoleId: {
      schema: 'crm_v2',
      table: 'roles',
      lookup: 'name',
      value: 'billing',
      select: 'roleId'
    }
  }
}
