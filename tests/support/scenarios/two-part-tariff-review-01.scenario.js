import chargeReferenceData from '../data/charge-reference.data.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceWithChargeVersionScenario from './unregistered-licence-with-charge-version.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Two-part tariff review 01'
export const description =
  'Testing a two-part tariff bill run with a simple scenario, licence is current and not in workflow, it has one applicable charge version with a single charge reference and element both of which are 2pt. It has just one return, and it and the charge element exactly match'

export default function (calculatedDates, endYear, startYear) {
  const { currentWinterReturnCycle } = calculatedDates

  const previousPeriodDetails = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: null,
    quarterly: false
  })

  const unregisteredLicenceWithChargeVersion = unregisteredLicenceWithChargeVersionScenario()

  const chargeReference = chargeReferenceData(unregisteredLicenceWithChargeVersion)
  const returnVersion = returnVersionData(unregisteredLicenceWithChargeVersion)

  const returnReference = 10021668
  const returnRequirement = returnRequirementData(returnVersion, unregisteredLicenceWithChargeVersion, returnReference)
  returnRequirement.returnRequirements[0].collectionFrequency = 'month'
  returnRequirement.returnRequirements[0].reportingFrequency = 'month'

  const returnLog = returnLogData(unregisteredLicenceWithChargeVersion, returnRequirement, previousPeriodDetails)
  returnLog.returnLogs[0].metadata.isTwoPartTariff = true

  const chargeAndReturnData = {
    returnSubmissions: [
      {
        id: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        returnId: `v1:1:AT/TE/ST/01/01:10021668:${startYear}-04-01:${endYear}-03-31`,
        returnLogId: '6a1b2456-e9af-4845-b5a9-a54497dff769',
        nilReturn: false,
        current: true
      }
    ],
    returnSubmissionLines: [
      {
        id: '89966f6f-bc62-40bf-97a5-3c7bfeeb2a3b',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-04-01`,
        endDate: `${startYear}-04-30`,
        quantity: '4000'
      },
      {
        id: '7e503eb2-323e-4b17-9d0c-2c8ad1ebe575',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-05-01`,
        endDate: `${startYear}-05-31`,
        quantity: '4000'
      },
      {
        id: '0438b460-52d6-40b5-9dfd-963a63ada23d',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-06-01`,
        endDate: `${startYear}-06-30`,
        quantity: '4000'
      },
      {
        id: 'e6a493df-241a-47de-ae62-b976d2ff9941',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-07-01`,
        endDate: `${startYear}-07-31`,
        quantity: '4000'
      },
      {
        id: 'fb9d239e-0428-4ca4-a7fd-49ae9ac1d6c7',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-08-01`,
        endDate: `${startYear}-08-31`,
        quantity: '4000'
      },
      {
        id: '85216196-0191-4fa3-9d3d-c1dba7d167ab',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-09-01`,
        endDate: `${startYear}-09-30`,
        quantity: '4000'
      },
      {
        id: '802c7690-0006-4267-af3e-7dcf29dda03c',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-10-01`,
        endDate: `${startYear}-10-31`,
        quantity: '4000'
      },
      {
        id: '30854030-2b23-4a3a-b4e4-1a30d3d6d260',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${endYear}-03-01`,
        endDate: `${endYear}-03-31`,
        quantity: '4000'
      }
    ]
  }

  return mergeByKey(
    unregisteredLicenceWithChargeVersion,
    chargeReference,
    returnVersion,
    returnRequirement,
    returnLog,
    chargeAndReturnData
  )
}
