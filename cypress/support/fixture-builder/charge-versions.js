import billingAccountData from './billing-account.js'
import licenceData from './licence.js'

export default function chargeVersions () {
  const billingAccount = billingAccountData()
  const licence = licenceData().licences[0]

  return {
    presroc: _presrocChargeVersion(billingAccount, licence),
    sroc: _srocChargeVersion(billingAccount, licence)
  }
}

function _presrocChargeVersion (billingAccount, licence) {
  return {
    id: '8e5626ee-5e4c-48f6-a668-471d35997e2c',
    licenceId: licence.id,
    licenceRef: licence.licenceRef,
    billingAccountId: billingAccount.id,
    regionCode: 9,
    scheme: 'alcs',
    versionNumber: 100,
    startDate: licence.startDate,
    status: 'current',
    source: 'nald',
    changeReasonId: {
      schema: 'water',
      table: 'changeReasons',
      lookup: 'description',
      value: 'Succession or transfer of licence',
      select: 'changeReasonId'
    }
  }
}

function _srocChargeVersion (billingAccount, licence) {
  return {
    id: '8e5626ee-5e4c-48f6-a668-471d35997e2c',
    licenceId: licence.id,
    licenceRef: licence.licenceRef,
    billingAccountId: billingAccount.id,
    regionCode: 9,
    scheme: 'sroc',
    versionNumber: 101,
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
