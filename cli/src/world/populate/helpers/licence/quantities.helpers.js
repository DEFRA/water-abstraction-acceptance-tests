/**
 * Change the quantities a licence can abstract up to
 *
 * A licence is built with an annual quantity of 1554 on its purpose, and no daily, hourly or instant quantity. This
 * gives each purpose all four, though the hourly and instant ones can be empty.
 *
 * The first purpose on a licence version is given the quantities at `first` in the list, the second the ones after, and
 * so on, going back to the start of the list when it runs out. So the purposes on a licence version have different
 * quantities. A purpose is in the same place on every licence version, so it has the same quantities on them all.
 *
 * Call this after everything has been added to the licence, as new purposes and licence versions are built with the
 * quantity a licence starts with.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object[]} quantities - the list of quantities, each for example
 * `{ annual: 20000, daily: 432, hourly: 36, instant: 10 }`
 * @param {number} first - where in the list the quantities for the first purpose are
 *
 * @returns {object} the same licence entity
 */
export function abstractUpTo(licenceEntity, quantities, first) {
  const licenceVersions = licenceEntity.licenceVersions ?? [licenceEntity.licenceVersion]
  const licenceVersionPurposes = licenceEntity.licenceVersionPurposes ?? [licenceEntity.licenceVersionPurpose]

  for (const licenceVersion of licenceVersions) {
    const purposesOnVersion = licenceVersionPurposes.filter((licenceVersionPurpose) => {
      return licenceVersionPurpose.licenceVersionId === licenceVersion.id
    })

    for (let i = 0; i < purposesOnVersion.length; i++) {
      const { annual, daily, hourly, instant } = quantities[(first + i) % quantities.length]

      purposesOnVersion[i].annualQuantity = annual
      purposesOnVersion[i].dailyQuantity = daily
      purposesOnVersion[i].hourlyQuantity = hourly
      purposesOnVersion[i].instantQuantity = instant
    }
  }

  return licenceEntity
}
