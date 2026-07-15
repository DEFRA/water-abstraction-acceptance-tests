import licenceData from './two-part-tariff-review-licence.js'

export default function chargeVersion() {
  const billingAccount = licenceData().billingAccounts[0]
  const licence = licenceData().licences[0]

  return {
    id: '8e5626ee-5e4c-48f6-a668-471d35997e2c',
    licenceId: licence.id,
    licenceRef: licence.licenceRef,
    billingAccountId: billingAccount.id,
    regionCode: 9,
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
