import { determineReturnCycleStartDate, formatDateToIso } from '../helpers/date.helpers.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licenceData, returnRequirementData, period) {
  const {
    licences: [licence],
    points
  } = licenceData

  const {
    returnRequirements: [returnRequirement],
    returnRequirementPurposes
  } = returnRequirementData

  const returnLogId = generateUUID()

  const startDate = new Date(period.startDate)
  const endDate = new Date(period.endDate)

  const startDateString = formatDateToIso(startDate)
  const endDateString = formatDateToIso(endDate)
  const dueDateString = period.dueDate ? formatDateToIso(new Date(period.dueDate)) : null

  const returnCycleStartDate = determineReturnCycleStartDate(startDate, returnRequirement.summer)

  return {
    returnLogs: [
      {
        id: returnLogId,
        returnId: `v1:9:${licence.licenceRef}:${returnRequirement.reference}:${startDateString}:${endDateString}`,
        returnReference: returnRequirement.reference,
        licenceRef: licence.licenceRef,
        metadata: {
          nald: {
            areaCode: 'AREA',
            formatId: returnRequirement.reference,
            regionCode: 9,
            periodEndDay: returnRequirement.abstractionPeriodEndDay,
            periodEndMonth: returnRequirement.abstractionPeriodEndMonth,
            periodStartDay: returnRequirement.abstractionPeriodStartDay,
            periodStartMonth: returnRequirement.abstractionPeriodStartMonth
          },
          points: points.map((point) => {
            return {
              name: point.description,
              ngr1: point.ngr1,
              ngr2: null,
              ngr3: null,
              ngr4: null
            }
          }),
          isFinal: false,
          version: 1,
          isSummer: returnRequirement.summer,
          isUpload: false,
          purposes: _purposes(returnRequirementPurposes),
          isCurrent: true,
          description: returnRequirement.siteDescription,
          isTwoPartTariff: false
        },
        returnsFrequency: 'month',
        startDate: startDateString,
        endDate: endDateString,
        dueDate: dueDateString,
        source: 'WRLS',
        status: 'due',
        underQuery: false,
        returnCycleId: {
          schema: 'returns',
          table: 'returnCycles',
          lookup: 'startDate',
          value: formatDateToIso(returnCycleStartDate),
          select: 'returnCycleId'
        },
        returnRequirementId: returnRequirement.id,
        quarterly: period.quarterly
      }
    ]
  }
}

/**
 * The return requirements data setup up the return requirements purpose.
 *
 * These are actually look-up values for the load function to handle, but the purpose 'code' is hard-coded in the
 * return requirement data. So we can use this here to help align wth our goal of making the data as real as possible.
 *
 * @private
 */
function _purposes(returnRequirementPurposes) {
  return returnRequirementPurposes.map((returnRequirementPurpose) => {
    return {
      alias: returnRequirementPurpose.alias,
      primary: {
        code: returnRequirementPurpose.primaryPurposeId.value,
        description: 'Agriculture'
      },
      secondary: {
        code: returnRequirementPurpose.secondaryPurposeId.value,
        description: 'General Agriculture'
      },
      tertiary: {
        code: returnRequirementPurpose.purposeId.value,
        description: 'Spray Irrigation - Direct'
      }
    }
  })
}
