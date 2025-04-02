'use strict'

/**
 * Helper methods to deal with return cycle dates
 * @module ReturnCycleDatesLib
 */

/**
 * The start, end and due dates for each return cycle
 */
const RETURN_CYCLE_DATES = {
  allYear: {
    dueDate: { day: 28, month: 3 },
    endDate: { day: 31, month: 2 },
    startDate: { day: 1, month: 3 }
  },
  summer: {
    dueDate: { day: 28, month: 10 },
    endDate: { day: 31, month: 9 },
    startDate: { day: 1, month: 10 }
  }
}

/**
 * Determine the due date of next provided cycle, either summer or winter and all year
 *
 * @param {boolean} summer - true for summer, false for winter and all year
 * @param {Date} [determinationDate] - the date by which to determine the cycle's 'due date' (defaults to current date)
 *
 * @returns {Date} the due date of the next cycle
 */
function determineCycleDueDate (summer, determinationDate = new Date()) {
  if (summer) {
    return _dueDate(determinationDate, RETURN_CYCLE_DATES.summer)
  }

  return _dueDate(determinationDate, RETURN_CYCLE_DATES.allYear)
}

/**
 * Determine the start date of next provided cycle, either summer or winter and all year
 *
 * @param {boolean} summer - true for summer, false for winter and all year
 * @param {Date} [determinationDate] - the date by which to determine the cycle's 'start date' (defaults to current
 * date)
 *
 * @returns {Date} the start date of the next cycle.
 */
function determineCycleStartDate (summer, determinationDate = new Date()) {
  if (summer) {
    return _startDate(determinationDate, RETURN_CYCLE_DATES.summer)
  }

  return _startDate(determinationDate, RETURN_CYCLE_DATES.allYear)
}

function _dueDate (determinationDate, cycle) {
  const year = determinationDate.getFullYear()
  const month = determinationDate.getMonth()

  const cycleDueDay = cycle.dueDate.day
  const cycleDueMonth = cycle.dueDate.month + 1
  const cycleDueYear = month > cycle.endDate.month ? year + 1 : year

  return new Date(`${cycleDueYear}-${cycleDueMonth}-${cycleDueDay}`)
}

function _endDate (determinationDate, cycle) {
  const year = determinationDate.getFullYear()
  const month = determinationDate.getMonth()

  const cycleEndDay = cycle.endDate.day
  const cycleEndMonth = cycle.endDate.month + 1
  const cycleEndYear = month > cycle.endDate.month ? year + 1 : year

  return new Date(`${cycleEndYear}-${cycleEndMonth}-${cycleEndDay}`)
}

function _startDate (determinationDate, cycle) {
  const year = determinationDate.getFullYear()
  const month = determinationDate.getMonth()

  const cycleStartDay = cycle.startDate.day
  const cycleStartMonth = cycle.startDate.month + 1
  const cycleStartYear = month < cycle.startDate.month ? year - 1 : year

  return new Date(`${cycleStartYear}-${cycleStartMonth}-${cycleStartDay}`)
}

module.exports = {
  determineCycleDueDate,
  determineCycleStartDate
}
