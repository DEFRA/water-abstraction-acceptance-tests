export default function returnLogs (howMany = 5) {
  const returnLogs = [
    {
      id: 'v1:9:AT/CURR/DAILY/01:9999990:2020-01-01:2020-03-31',
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
      startDate: '2020-01-01',
      endDate: '2020-03-31',
      dueDate: '2020-04-28',
      status: 'due',
      underQuery: false,
      returnCycleId: {
        schema: 'returns',
        table: 'returnCycles',
        lookup: 'startDate',
        value: '2019-04-01',
        select: 'returnCycleId'
      }
    },
    {
      id: 'v1:9:AT/CURR/DAILY/01:9999990:2020-04-01:2021-03-31',
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
      startDate: '2020-04-01',
      endDate: '2021-03-31',
      dueDate: '2021-04-28',
      status: 'completed',
      underQuery: false,
      returnCycleId: {
        schema: 'returns',
        table: 'returnCycles',
        lookup: 'startDate',
        value: '2020-04-01',
        select: 'returnCycleId'
      }
    },
    {
      id: 'v1:9:AT/CURR/DAILY/01:9999990:2021-04-01:2022-03-31',
      returnReference: '9999990',
      licenceRef: 'AT/CURR/DAILY/01',
      metadata: {
        nald: {
          areaCode: 'AREA',
          formatId: 9999990,
          regionCode: 9,
          periodEndDay: '28',
          periodEndMonth: '02',
          periodStartDay: '1',
          periodStartMonth: '1'
        },
        points: [
          {
            name: 'Winter',
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
      startDate: '2021-04-01',
      endDate: '2022-03-31',
      dueDate: '2022-04-28',
      status: 'completed',
      underQuery: false,
      returnCycleId: {
        schema: 'returns',
        table: 'returnCycles',
        lookup: 'startDate',
        value: '2021-04-01',
        select: 'returnCycleId'
      }
    },
    {
      id: 'v1:9:AT/CURR/DAILY/01:9999990:2022-04-01:2023-03-31',
      returnReference: '9999990',
      licenceRef: 'AT/CURR/DAILY/01',
      metadata: {
        nald: {
          areaCode: 'AREA',
          formatId: 9999990,
          regionCode: 9,
          periodEndDay: '28',
          periodEndMonth: '02',
          periodStartDay: '1',
          periodStartMonth: '1'
        },
        points: [
          {
            name: 'Winter',
            ngr1: 'TG 123 456',
            ngr2: null,
            ngr3: null,
            ngr4: null
          }
        ],
        isFinal: false,
        version: 2,
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
    },
    {
      id: 'v1:9:AT/CURR/DAILY/01:9999990:2024-04-01:2025-03-31',
      returnReference: '9999990',
      licenceRef: 'AT/CURR/DAILY/01',
      metadata: {
        nald: {
          areaCode: 'AREA',
          formatId: 9999990,
          regionCode: 9,
          periodEndDay: '28',
          periodEndMonth: '02',
          periodStartDay: '1',
          periodStartMonth: '1'
        },
        points: [
          {
            name: 'Winter',
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
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      dueDate: '2025-04-28',
      status: 'completed',
      underQuery: false,
      returnCycleId: {
        schema: 'returns',
        table: 'returnCycles',
        lookup: 'startDate',
        value: '2024-04-01',
        select: 'returnCycleId'
      }
    },
    {
      id: 'v1:9:AT/CURR/DAILY/01:9999990:2025-04-01:2026-03-31',
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
      startDate: '2025-04-01',
      endDate: '2026-03-31',
      dueDate: '2026-04-28',
      status: 'completed',
      underQuery: false,
      returnCycleId: {
        schema: 'returns',
        table: 'returnCycles',
        lookup: 'startDate',
        value: '2025-04-01',
        select: 'returnCycleId'
      }
    }
  ]

  return {
    returnLogs: JSON.parse(JSON.stringify(returnLogs.slice(0, howMany)))
  }
}
