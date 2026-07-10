export default function (licenceAndMonitoringStationData) {
  const {
    licences: [licence],
    monitoringStations: [monitoringStation]
  } = licenceAndMonitoringStationData

  return {
    licenceMonitoringStations: [
      {
        licenceId: licence.id,
        monitoringStationId: monitoringStation.id,
        abstractionPeriodStartDay: 10,
        abstractionPeriodStartMonth: 10,
        abstractionPeriodEndDay: 11,
        abstractionPeriodEndMonth: 11,
        restrictionType: 'stop'
      }
    ]
  }
}
