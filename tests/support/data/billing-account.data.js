import { generateUUID } from '../helpers/generate-uuid.js'

export default function (companyData) {
  const {
    companies: [company]
  } = companyData

  return {
    billingAccounts: [
      {
        id: generateUUID(),
        accountNumber: 'A99999991A',
        companyId: company.id
      }
    ]
  }
}
