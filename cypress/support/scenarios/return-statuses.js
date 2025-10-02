import formatDateToIso from '../helpers/formatDateToIso.js'
import licenceData from '../fixture-builder/licence.js'

function _returnLog (startDate, endDate, dueDate, returnReference) {
  const startDateString = formatDateToIso(startDate)
  const endDateString = formatDateToIso(endDate)
  const dueDateString = dueDate ? formatDateToIso(dueDate) : null

  return {
    id: `v1:1:AT/TEST/01:${returnReference}:${startDateString}:${endDateString}`,
    returnReference: returnReference.toString(),
    licenceRef: 'AT/TEST/01',
    metadata: {
      nald: {
        areaCode: 'AREA',
        formatId: returnReference,
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
    startDate: startDateString,
    endDate: endDateString,
    dueDate: dueDateString,
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
}

function _returnLogs () {
  const returnLogs = []
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  // Does the current date fall in April to December, or January to March.
  const beforeNewYear = (today.getMonth() + 1) > 3

  let startDate
  if (beforeNewYear) {
    startDate = new Date(`${today.getFullYear() + 1}-04-01`)
  } else {
    startDate = new Date(`${today.getFullYear()}-04-01`)
  }

  let endDate = new Date(`${startDate.getFullYear() + 1}-03-31`)
  let dueDate = null

  // NOT DUE YET - We've set the start and end date in the future so it cannot be submitted hence the status
  let returnLog = _returnLog(startDate, endDate, dueDate, 9999990)
  returnLogs.push(returnLog)

  // COMPLETE - Set the period to last year for
  startDate.setFullYear(startDate.getFullYear() - 2)
  endDate.setFullYear(endDate.getFullYear() - 2)
  dueDate = new Date(`${endDate.getFullYear()}-04-28`)

  returnLog = _returnLog(startDate, endDate, dueDate, 9999991)
  returnLog.status = 'completed'
  returnLogs.push(returnLog)

  // OPEN - Leave the date as is, which means it will be past its end date with a null due date
  dueDate = null
  returnLog = _returnLog(startDate, endDate, dueDate, 9999993)
  returnLogs.push(returnLog)

  // VOID - Copy the previous but mark it as voided
  returnLog = _returnLog(startDate, endDate, dueDate, 9999992)
  returnLog.status = 'void'
  returnLogs.push(returnLog)

  // DUE - If the current month is April, we're going to leave the return log in last year. Else we'll bring it into
  // the current year
  if ((today.getMonth() + 1) !== 4) {
    startDate.setFullYear(startDate.getFullYear() + 1)
  }
  // set the due date to be a few days in the future
  dueDate = new Date(today)
  dueDate.setDate(dueDate.getDate() + 5)

  // set the end date to be a month ago
  endDate = new Date(today)
  endDate.setMonth(today.getMonth() - 1)

  returnLog = _returnLog(startDate, endDate, dueDate, 9999994)
  returnLogs.push(returnLog)

  // OVERDUE
  dueDate.setDate(dueDate.getDate() - 6)
  returnLog = _returnLog(startDate, endDate, dueDate, 9999995)
  returnLogs.push(returnLog)

  return returnLogs
}

export default function () {
  return {
    ...licenceData(),
    returnLogs: _returnLogs()
  }
}
