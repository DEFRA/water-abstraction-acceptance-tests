import { formatDateToIso } from '../helpers/date.helpers.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licenceData, returnRequirementData, period) {
  const {
    licences: [licence],
    points: [point]
  } = licenceData

  const {
    returnRequirements: [returnRequirement]
  } = returnRequirementData

  const returnLogId = generateUUID()

  const startDate = new Date(period.startDate)
  const endDate = new Date(period.endDate)

  const startDateString = formatDateToIso(startDate)
  const endDateString = formatDateToIso(endDate)
  const dueDateString = period.dueDate ? formatDateToIso(new Date(period.dueDate)) : null

  return {
    returnLogs: [
      {
        id: returnLogId,
        returnId: `v1:8:${licence.licenceRef}:${returnRequirement.legacyId}:${startDateString}:${endDateString}`,
        returnReference: returnRequirement.legacyId,
        licenceRef: licence.licenceRef,
        metadata: {
          nald: {
            areaCode: 'AREA',
            formatId: returnRequirement.legacyId,
            regionCode: 9,
            periodEndDay: '31',
            periodEndMonth: '12',
            periodStartDay: '1',
            periodStartMonth: '1'
          },
          points: [
            {
              name: point.description,
              ngr1: point.ngr1,
              ngr2: null,
              ngr3: null,
              ngr4: null
            }
          ],
          isFinal: false,
          version: 1,
          isSummer: returnRequirement.summer,
          isUpload: false,
          purposes: [
            {
              alias: 'SPRAY IRRIGATION STORAGE',
              primary: {
                code: 'A',
                description: 'Agriculture'
              },
              secondary: {
                code: 'AGR',
                description: 'General Agriculture'
              },
              tertiary: {
                code: '420',
                description: 'Spray Irrigation - Storage'
              }
            }
          ],
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
          value: `${startDate.getFullYear()}-04-01`,
          select: 'returnCycleId'
        },
        returnRequirementId: returnRequirement.id,
        quarterly: period.quarterly
      }
    ]
  }
}
