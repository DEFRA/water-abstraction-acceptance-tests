import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function () {
  const monitoringStationId = generateUUID()

  return {
    id: monitoringStationId,
    catchmentName: 'Test Catchment',
    gridReference: 'ST1234567890',
    label: 'Test Station'
  }
}
