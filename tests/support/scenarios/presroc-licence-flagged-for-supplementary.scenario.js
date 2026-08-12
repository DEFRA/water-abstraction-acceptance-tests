import { srocStartDate } from '../default-values.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import { formatDateToIso } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { asArrays } from '../helpers/wire-format.helpers.js'
import presrocLicenceWithChargeVersionScenario from './presroc-licence-with-charge-version.scenario.js'

export const title = 'Presroc and sroc licence flagged for presroc and sroc supplementary billing'
export const description =
  'A presroc and sroc licence with both an alcs charge version and a second, ongoing sroc charge version, flagged for both the next presroc and sroc supplementary bill runs'

export default function () {
  const scenario = presrocLicenceWithChargeVersionScenario()

  // This is what flags the licence for the next presroc and sroc supplementary bill runs — without it, each
  // engine's charge version query excludes the licence entirely
  scenario.licence.includeInPresrocBilling = 'yes'
  scenario.licence.includeInSrocBilling = true

  // The presroc charge version ends the day before the sroc one below begins, reflecting a licence that was
  // properly superseded at the scheme boundary rather than one left open-ended
  const presrocChargeVersionEndDate = new Date(srocStartDate)

  presrocChargeVersionEndDate.setUTCDate(presrocChargeVersionEndDate.getUTCDate() - 1)

  scenario.chargeVersion.endDate = formatDateToIso(presrocChargeVersionEndDate)

  const srocChargeVersionEntity = _srocChargeVersion(
    scenario.company,
    scenario.address,
    scenario.licence,
    scenario.licenceVersionPurpose
  )

  return mergeByKey(asArrays(scenario), asArrays(srocChargeVersionEntity))
}

/**
 * Builds the sroc charge version that succeeds the presroc licence's alcs one
 *
 * Left open-ended rather than scoped to a single year, so the sroc engine has every outstanding sroc period to bill,
 * not just the first one
 *
 * @private
 */
function _srocChargeVersion(company, address, licence, licenceVersionPurpose) {
  const chargeVersionEntity = buildChargeVersionEntity(company, address, licence, licenceVersionPurpose)

  chargeVersionEntity.billingAccount.accountNumber = 'S99999992A'

  // Starts on the sroc scheme's first day rather than inheriting the licence's own (pre-sroc) start date, and uses
  // the change reason a real presroc-to-sroc transition would have, rather than the "New licence" default
  chargeVersionEntity.chargeVersion.startDate = srocStartDate
  chargeVersionEntity.chargeVersion.changeReasonId.value = 'Strategic review of charges (SRoC)'

  return chargeVersionEntity
}
