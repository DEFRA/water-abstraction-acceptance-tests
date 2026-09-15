import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (billLicence, chargeReference, dates, netAmount) {
  return {
    id: generateUUID(),
    billLicenceId: billLicence.id,
    chargeReferenceId: chargeReference.id,
    chargeType: 'standard',
    startDate: dates.startDate,
    endDate: dates.endDate,
    // A presroc (alcs scheme) transaction must have an abstraction period — unlike sroc, the DB check constraint
    // doesn't waive this for the alcs scheme
    abstractionPeriod: {
      startDay: chargeReference.abstractionPeriodStartDay,
      startMonth: chargeReference.abstractionPeriodStartMonth,
      endDay: chargeReference.abstractionPeriodEndDay,
      endMonth: chargeReference.abstractionPeriodEndMonth
    },
    source: chargeReference.source,
    loss: chargeReference.loss,
    scheme: chargeReference.scheme,
    section127Agreement: chargeReference.section127Agreement,
    // TransactionHelper defaults section130Agreement to the string 'false', which the legacy engine that
    // processes alcs-scheme transactions treats as a truthy agreement code and rejects — must be null
    section126Factor: null,
    section130Agreement: null,
    description: chargeReference.description,
    purposes: [{}],
    netAmount,
    credit: false
  }
}
