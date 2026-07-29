import licenceWithScenario from './licence-with-workflow-and-bill-run.scenario.js'

export const title = 'Licence with a charge version, a bill run and a workflow entry awaiting set up'
export const description =
  'Licence with a current SRoC charge version, sent annual and two-part tariff bill runs, and a workflow entry still awaiting charge information set up'

export default function (calculatedDates) {
  const licence = licenceWithScenario(calculatedDates)

  const {
    licenceVersions: [{ id: licenceVersionId }],
    workflows: [workflow]
  } = licence

  // workflow.data.js defaults to a 'review' entry with a draft charge version, but this scenario needs a licence
  // still waiting for its first charge information set up, so we switch it to a 'to_setup' entry pointing at the
  // licence version instead
  delete workflow.data
  workflow.status = 'to_setup'
  workflow.licenceVersionId = licenceVersionId

  return licence
}
