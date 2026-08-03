import licenceWithTptChargeVersionAndCompletedReturnLogScenario from './licence-with-tpt-chg-vers-and-completed-return-log.scenario.js'
import { formatDateToIso } from '../helpers/date.helpers.js'

export const title = 'Licence with tpt charge version and a return straddling the charge period'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle whose first submission line starts before the charge period, straddling it to flag an overlap of charge dates issue'

export default function (calculatedDates) {
  const licence = licenceWithTptChargeVersionAndCompletedReturnLogScenario(calculatedDates)

  const {
    returnSubmissionLines: [firstSubmissionLine]
  } = licence

  // Move the first submission line's start date before the charge period start so the line straddles the boundary
  const straddleStartDate = new Date(firstSubmissionLine.startDate)

  straddleStartDate.setUTCDate(straddleStartDate.getUTCDate() - 5)
  firstSubmissionLine.startDate = formatDateToIso(straddleStartDate)

  return licence
}
