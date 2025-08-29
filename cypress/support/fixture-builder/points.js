export default function points (howMany = 1) {
  const points = [
    {
      id: '1cb602f8-6a01-4435-96b0-541e03f460da',
      description: 'Example point 1',
      ngr1: 'TQ 1234 5678',
      externalId: '9:9000090',
      sourceId: {
        schema: 'public',
        table: 'sources',
        lookup: 'legacyId',
        value: 'S',
        select: 'id'
      }
    },
    {
      id: '82fab927-ef31-45a2-a4e6-104315cb9764',
      description: 'Example point 2',
      ngr1: 'TT 9876 5432',
      externalId: '9:9000091',
      sourceId: {
        schema: 'public',
        table: 'sources',
        lookup: 'legacyId',
        value: 'S',
        select: 'id'
      }
    }
  ]

  return {
    points: JSON.parse(JSON.stringify(points.slice(0, howMany)))
  }
}
