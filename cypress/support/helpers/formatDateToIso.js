export default function (date) {
  const dateValue = new Date(date)

  return dateValue.toISOString().split('T')[0]
}
