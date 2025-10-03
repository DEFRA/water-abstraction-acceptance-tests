import licenceData from '../fixture-builder/licence.js'
import monitoringStationData from '../fixture-builder/monitoring-stations.js'

export default function () {
  return {
    ...licenceData(),
    ...monitoringStationData()
  }
}
