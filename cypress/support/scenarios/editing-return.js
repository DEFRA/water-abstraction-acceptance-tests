import licenceData from '../fixture-builder/licence.js'

export default function() {
  return {
    ...licenceData(),
    billRuns: [
      {
        regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: 9, select: 'id' },
        batchType: 'two_part_tariff',
        fromFinancialYearEnding: '2023',
        toFinancialYearEnding: '2023',
        status: 'sent'
      }
    ],
    returnLogs: [
      {
        id: 'v1:1:AT/CURR/DAILY/01:9999990:2022-04-01:2023-03-31',
        returnReference: '9999990',
        licenceRef: 'AT/CURR/DAILY/01',
        metadata: {
          nald: {
            areaCode: 'AREA',
            formatId: 9999990,
            regionCode: 9,
            periodEndDay: '31',
            periodEndMonth: '12',
            periodStartDay: '1',
            periodStartMonth: '1'
          },
          points: [
            {
              name: 'The Name of this',
              ngr1: 'TG 123 456',
              ngr2: null,
              ngr3: null,
              ngr4: null
            }
          ],
          isFinal: false,
          version: 1,
          isSummer: false,
          isUpload: false,
          purposes: [
            {
              alias: 'SPRAY IRRIGATION STORAGE',
              primary: {
                code: 'A',
                description: 'Agriculture'
              },
              secondary: {
                code: 'AGR',
                description: 'General Agriculture'
              },
              tertiary: {
                code: '420',
                description: 'Spray Irrigation - Storage'
              }
            }
          ],
          isCurrent: true,
          description: 'Its all about the description',
          isTwoPartTariff: true
        },
        returnsFrequency: 'month',
        startDate: '2022-04-01',
        endDate: '2023-03-31',
        dueDate: '2023-04-28',
        status: 'completed',
        underQuery: false,
        returnCycleId: {
          schema: 'returns',
          table: 'returnCycles',
          lookup: 'startDate',
          value: '2022-04-01',
          select: 'returnCycleId'
        }
      }
    ]
  }
}
