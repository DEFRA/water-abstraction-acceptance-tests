export default function (date) {
  return date.toISOString().split('T')[0]
}
