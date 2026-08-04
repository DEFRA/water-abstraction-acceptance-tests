export default function (licence, monitoringStation) {
  return {
    licenceId: licence.id,
    monitoringStationId: monitoringStation.id,
    abstractionPeriodStartDay: 10,
    abstractionPeriodStartMonth: 10,
    abstractionPeriodEndDay: 11,
    abstractionPeriodEndMonth: 11,
    restrictionType: 'stop'
  }
}
