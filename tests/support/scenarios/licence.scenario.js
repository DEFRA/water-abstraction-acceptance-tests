import licenceEntity from '../entities/licence.entity.js'

export const title = 'Licence only'
export const description = 'Just the licence, licence version, and licence holder (company)'

export default function () {
  return licenceEntity()
}
