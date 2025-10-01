import licenceData from '../fixture-builder/licence.js'
import monitoringStationData from '../fixture-builder/monitoring-stations.js'

export default function () {
  return {
    ...licenceData(),
    licenceVersionPurposeConditions: [
      {
        licenceVersionPurposeId: 'f264184b-22a7-4e26-bd90-d5738eb2e07e',
        licenceVersionPurposeConditionTypeId: {
          schema: 'public',
          table: 'licenceVersionPurposeConditionTypes',
          lookup: 'subcode',
          value: 'LEV',
          select: 'id'
        },
        notes: 'Test condition notes'
      }
    ],
    ...monitoringStationData(),
    licenceMonitoringStations: [
      {
        licenceId: '8717da0e-28d4-4833-8e32-1da050b60055',
        monitoringStationId: '3cfc9486-c3da-4a2e-b1be-020ce805be46',
        abstractionPeriodStartDay: 10,
        abstractionPeriodStartMonth: 10,
        abstractionPeriodEndDay: 11,
        abstractionPeriodEndMonth: 11,
        restrictionType: 'stop'
      }
    ]
  }
}
