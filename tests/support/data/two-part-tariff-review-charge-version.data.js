import reviewLicenceData from './two-part-tariff-review-licence.data.js'
import { regionCode } from '../static.lib.js'

export default function () {
  const {
    billingAccounts: [billingAccount],
    licences: [licence]
  } = reviewLicenceData()

  return {
    id: '8e5626ee-5e4c-48f6-a668-471d35997e2c',
    licenceId: licence.id,
    licenceRef: licence.licenceRef,
    billingAccountId: billingAccount.id,
    regionCode,
    scheme: 'sroc',
    versionNumber: 100,
    startDate: '2022-04-01',
    status: 'current',
    source: 'wrls',
    changeReasonId: {
      schema: 'water',
      table: 'changeReasons',
      lookup: 'description',
      value: 'Strategic review of charges (SRoC)',
      select: 'changeReasonId'
    }
  }
}
