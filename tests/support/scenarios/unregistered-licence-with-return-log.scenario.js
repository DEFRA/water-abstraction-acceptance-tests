import licenceWithReturnLogScenario from './return-log.scenario.js'

export const title = 'Unregistered licence with a return log (current period)'
export const description =
  'Unregistered licence with a due return log for the first current return period with no due date set'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  return licenceWithReturnLogScenario({
    startDate: firstReturnPeriod.startDate,
    endDate: firstReturnPeriod.endDate,
    dueDate: null,
    quarterly: firstReturnPeriod.quarterly
  })
}
