import { splitTotalVolume } from '../helpers/conversion.helpers.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (period, returnLogData, totalVolume) {
  const {
    returnLogs: [returnLog]
  } = returnLogData

  const returnSubmissionId = generateUUID()

  const startYear = period.startDate.getFullYear()
  const endYear = period.endDate.getFullYear()

  const splitVolumes = splitTotalVolume(totalVolume, 12)

  return {
    returnSubmissions: [
      {
        id: returnSubmissionId,
        returnId: returnLog.returnId,
        returnLogId: returnLog.id,
        nilReturn: false,
        current: true
      }
    ],
    returnSubmissionLines: [
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-04-01`,
        endDate: `${startYear}-04-30`,
        quantity: splitVolumes[0]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-05-01`,
        endDate: `${startYear}-05-31`,
        quantity: splitVolumes[1]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-06-01`,
        endDate: `${startYear}-06-30`,
        quantity: splitVolumes[2]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-07-01`,
        endDate: `${startYear}-07-31`,
        quantity: splitVolumes[3]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-08-01`,
        endDate: `${startYear}-08-31`,
        quantity: splitVolumes[4]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-09-01`,
        endDate: `${startYear}-09-30`,
        quantity: splitVolumes[5]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-10-01`,
        endDate: `${startYear}-10-31`,
        quantity: splitVolumes[6]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-11-01`,
        endDate: `${startYear}-11-30`,
        quantity: splitVolumes[7]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${startYear}-12-01`,
        endDate: `${startYear}-12-31`,
        quantity: splitVolumes[8]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${endYear}-01-01`,
        endDate: `${endYear}-01-31`,
        quantity: splitVolumes[9]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${endYear}-02-01`,
        endDate: `${endYear}-02-28`,
        quantity: splitVolumes[10]
      },
      {
        id: generateUUID(),
        returnSubmissionId,
        startDate: `${endYear}-03-01`,
        endDate: `${endYear}-03-31`,
        quantity: splitVolumes[11]
      }
    ]
  }
}
