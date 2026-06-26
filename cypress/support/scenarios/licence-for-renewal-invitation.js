import licenceData from '../fixture-builder/licence.js'

export const title = 'Licence for renewal invitation'
export const description = 'Licence expiring more than 90 days ahead, making it eligible for a renewal invitation'

export default function () {
  const dataModel = {
    ...licenceData()
  }

  // The expired date needs to be more than 90 days in the future for the licence to be eligible for a renewal invitation.
  const expiredDate = new Date()
  expiredDate.setDate(expiredDate.getDate() + 91)
  dataModel.licences[0].expiredDate = expiredDate.toISOString().split('T')[0]

  return dataModel
}
