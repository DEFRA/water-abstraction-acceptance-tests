import licenceData from '../fixture-builder/licence.js'

export default function() {
  return {
    ...licenceData(),
    workflows: [
    {
      licenceId: '8717da0e-28d4-4833-8e32-1da050b60055',
      licenceVersionId: '7ac6be4b-b7a0-4e35-9cd4-bd1c783af32b',
      status: 'to_setup',
      data: {
        chargeVersion: null,
        source: 'acceptance-test-setup'
      }
    }
  ]
  }
}
