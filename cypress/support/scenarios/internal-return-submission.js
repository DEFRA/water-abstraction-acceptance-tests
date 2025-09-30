import licenceData from '../fixture-builder/licence.js'

export default function() {
  return {
    ...licenceData(),
    returnLogs: [
      {
        id: 'v1:1:AT/CURR/DAILY/01:9999990:2020-01-01:2020-03-31',
        returnReference: '9999990',
        licenceRef: 'AT/CURR/DAILY/01',
        metadata: {
          nald: {
            areaCode: 'AREA',
            formatId: 9999990,
            regionCode: 1,
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
        startDate: '2020-04-01',
        endDate: '2021-03-31',
        dueDate: '2021-04-28',
        status: 'due',
        underQuery: false,
        returnCycleId: {
          schema: 'returns',
          table: 'returnCycles',
          lookup: 'startDate',
          value: '2020-04-01',
          select: 'returnCycleId'
        }
      }
    ]
  }
}
