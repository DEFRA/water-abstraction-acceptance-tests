import licenceData from '../fixture-builder/licence.js'
import monitoringStationData from '../fixture-builder/monitoring-stations.js'

export const title = 'Monitoring station (untagged)'
export const description = 'Licence and monitoring station created separately with no licence monitoring station link'

export default function () {
  return {
    ...licenceData(),
    ...monitoringStationData()
  }
}
