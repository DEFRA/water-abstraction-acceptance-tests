// We do not control when the tests are run so sometimes we need a date that is within the current financial year when
// they are. For example, when testing billing scenarios we often only want to make charge information changes within
// the current year to avoid additional calculations for previous years.
//
// It defaults to the last possible date. If the current date was 2023-06-05 it would return 2024-03-31. You can
// override the day and month (don't worry about month being zero-indexed - it gets dealt with!) and adjust the year
// by plus or minus as many years as you need.
export default function currentFinancialYear (day = 31, month = 3, yearAdjuster = 0) {
  // IMPORTANT! getMonth returns an integer (0-11). So, January is represented as 0 and December as 11. This is why
  // MARCH is 2 rather than 3
  const MARCH = 2

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  let endYear

  if (currentDate.getMonth() <= MARCH) {
    // For example, if currentDate was 2022-02-15 it would fall in financial year 2021-04-01 to 2022-03-31
    endYear = currentYear + yearAdjuster
  } else {
    // For example, if currentDate was 2022-06-15 it would fall in financial year 2022-04-01 to 2023-03-31
    endYear = currentYear + 1 + yearAdjuster
  }

  // Rather than just return the start and end dates, we return them as objects with the both the dates and the date
  // parts so the tests can use them for input fields.
  const result = {
    end: { date: new Date(`${endYear}-${month}-${day}`), day, month, year: endYear },
    start: { date: new Date(`${endYear - 1}-04-01`), day: 1, month: 4, year: endYear - 1 }
  }

  return result
}
