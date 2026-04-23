/**
 * Given a return period, returns a new period with the same properties but start and end dates moved back 1 period
 *
 * If the given period is quarterly, the dates will be moved back by 3 months. If it's not quarterly, the dates will be
 * moved back by 12 months.
 *
 * @param {object} period - The return period to calculate the previous period for
 *
 * @return {object} The previous return period to the one provided
 */
export default function (period) {
  const previousPeriod = {
    dueDate: period.dueDate ? new Date(period.dueDate) : null,
    endDate: new Date(period.endDate),
    name: period.name,
    quarterly: period.quarterly,
    startDate: new Date(period.startDate)
  }

  let monthsBack = 12
  if (period.quarterly) {
    monthsBack = 3
  }

  previousPeriod.endDate.setMonth(previousPeriod.endDate.getMonth() - monthsBack)
  previousPeriod.startDate.setMonth(previousPeriod.startDate.getMonth() - monthsBack)

  if (period.dueDate) {
    previousPeriod.dueDate.setMonth(previousPeriod.dueDate.getMonth() - monthsBack)
  }

  return previousPeriod
}
