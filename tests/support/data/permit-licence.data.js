export default function (licence) {
  return {
    licenceRef: licence.licenceRef,
    startDate: licence.startDate,
    metadata: {
      source: 'acceptance-test-setup'
    }
  }
}
