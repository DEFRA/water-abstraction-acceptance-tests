import { srocStartDate } from '../default-values.js'
import licenceWithCurrentAnnualBillRunScenario from './licence-flagged-for-supplementary-with-current-annual-bill-run.scenario.js'

export const title =
  'Licence flagged for supplementary billing with a full sroc charge history, and a sent annual bill run for the current year'
export const description =
  'The current-year annual bill run scenario, with the licence and its charge version starting on the sroc scheme start date so every outstanding sroc period has something to bill'

export default function () {
  const licence = licenceWithCurrentAnnualBillRunScenario()

  // Without this, both the licence and its charge version only cover the last year or so (their default start
  // dates), so there's nothing for a supplementary bill run to pick up in earlier sroc periods
  licence.licence.startDate = srocStartDate
  licence.licenceVersion.startDate = srocStartDate
  licence.licenceDocument.startDate = srocStartDate
  licence.licenceDocumentRole.startDate = srocStartDate
  licence.chargeVersion.startDate = srocStartDate

  return licence
}
