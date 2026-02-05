import currentFinancialYear from '../helpers/currentFinancialYear.js'

export default function billRuns () {
  const currentFinancialYearInfo = currentFinancialYear()

  return {
    sroc: {
      annual: {
        standard: _srocStandardAnnual(currentFinancialYearInfo),
        twoPartTariff: _srocTwoPartTariffAnnual(currentFinancialYearInfo)
      }
    }
  }
}

function _srocStandardAnnual (currentFinancialYearInfo) {
  const financialYearEnd = currentFinancialYearInfo.end.year

  return {
    id: '44ee8b2a-5557-490f-90cd-676d1b8038bf',
    regionId: {
      schema: 'public',
      table: 'regions',
      lookup: 'naldRegionId',
      value: 9,
      select: 'id'
    },
    batchType: 'annual',
    fromFinancialYearEnding: financialYearEnd,
    toFinancialYearEnding: financialYearEnd,
    scheme: 'sroc',
    status: 'sent',
    source: 'wrls',
    metadata: {
      source: 'acceptance-test-setup'
    }
  }
}

function _srocTwoPartTariffAnnual (currentFinancialYearInfo) {
  const financialYearEnd = currentFinancialYearInfo.end.year - 1

  return {
    id: '44ee8b2a-5557-490f-90cd-676d1b8038bf',
    regionId: {
      schema: 'public',
      table: 'regions',
      lookup: 'naldRegionId',
      value: 9,
      select: 'id'
    },
    batchType: 'two_part_tariff',
    fromFinancialYearEnding: financialYearEnd,
    toFinancialYearEnding: financialYearEnd,
    scheme: 'sroc',
    status: 'sent',
    source: 'wrls',
    metadata: {
      source: 'acceptance-test-setup'
    }
  }
}
