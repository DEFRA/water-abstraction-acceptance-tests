import { generateUUID } from '../helpers/generate-uuid.js'

export default function () {
  const monitoringStationId = generateUUID()

  return {
    monitoringStations: [
      {
        id: monitoringStationId,
        catchmentName: 'Test Catchment',
        gridReference: 'ST1234567890',
        label: 'Test Station'
      }
    ]
  }
}
