/**
 * Change the abstraction period a licence abstracts during
 *
 * A licence is built with an abstraction period of 1 April to 31 March. This gives it another, for example 1 November
 * to 31 March. Every purpose on every licence version is given the same one.
 *
 * Call this after everything has been added to the licence, as new purposes and licence versions are built with the
 * period a licence starts with.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} abstractionPeriod - the period, for example
 * `{ startDay: 1, startMonth: 11, endDay: 31, endMonth: 3 }`
 *
 * @returns {object} the same licence entity
 */
export function abstractDuring(licenceEntity, abstractionPeriod) {
  const licenceVersionPurposes = licenceEntity.licenceVersionPurposes ?? [licenceEntity.licenceVersionPurpose]

  for (const licenceVersionPurpose of licenceVersionPurposes) {
    licenceVersionPurpose.abstractionPeriodStartDay = abstractionPeriod.startDay
    licenceVersionPurpose.abstractionPeriodStartMonth = abstractionPeriod.startMonth
    licenceVersionPurpose.abstractionPeriodEndDay = abstractionPeriod.endDay
    licenceVersionPurpose.abstractionPeriodEndMonth = abstractionPeriod.endMonth
  }

  return licenceEntity
}
