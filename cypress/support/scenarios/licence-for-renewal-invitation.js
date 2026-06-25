import licenceData from '../fixture-builder/licence.js'

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
