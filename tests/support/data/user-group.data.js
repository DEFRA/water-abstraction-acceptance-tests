import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (user, group) {
  return {
    id: generateUUID(),
    userId: {
      schema: 'public',
      table: 'users',
      lookup: 'id',
      value: user.id,
      select: 'userId'
    },
    groupId: {
      schema: 'public',
      table: 'groups',
      lookup: 'group',
      value: group,
      select: 'id'
    }
  }
}
