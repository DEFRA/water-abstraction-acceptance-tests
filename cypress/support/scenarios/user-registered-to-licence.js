import licenceData from '../fixture-builder/licence.js'
import usersData from '../fixture-builder/users.js'

export default function () {
  const dataModel = {
    ...licenceData()
  }

  const primaryUser = usersData().external

  primaryUser.licenceEntityId = dataModel.licenceEntities[0].id
  dataModel.licenceEntities[0].name = primaryUser.username

  dataModel.users = [primaryUser]

  return dataModel
}
