import licenceData from '../fixture-builder/licence.js'

export const title = 'One licence only'
export const description = 'Minimal licence data with no return logs, bill runs, workflows, or user accounts'

export default function () {
  return {
    ...licenceData()
  }
}
