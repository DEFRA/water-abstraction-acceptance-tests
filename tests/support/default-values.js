/**
 * When a scenario or data file needs a password, we use P@55word as our default.
 * @type {string}
 */
export const password = 'P@55word'

/**
 * When a scenario or data file needs a region and doesn't care which one, we default to the Anglian region.
 * Scenarios that need to exercise a specific region (for example, so a billing group doesn't collide with
 * another) pass their own region through instead of relying on this default.
 * @type {{naldRegionId: number, chargeRegionId: string, displayName: string}}
 */
export const defaultRegion = { naldRegionId: 1, chargeRegionId: 'A', displayName: 'Anglian' }

/**
 * The region the supplementary billing scenarios seed against, so their data doesn't collide with the other
 * billing groups.
 * @type {{naldRegionId: number, chargeRegionId: string, displayName: string}}
 */
export const supplementaryRegion = { naldRegionId: 2, chargeRegionId: 'B', displayName: 'Midlands' }

/**
 * The region the two-part tariff billing scenarios seed against, so their data doesn't collide with the other
 * billing groups.
 * @type {{naldRegionId: number, chargeRegionId: string, displayName: string}}
 */
export const twoPartTariffRegion = { naldRegionId: 3, chargeRegionId: 'Y', displayName: 'North East' }

/**
 * The region the two-part tariff supplementary billing scenarios seed against, so their data doesn't collide with
 * the other billing groups.
 * @type {{naldRegionId: number, chargeRegionId: string, displayName: string}}
 */
export const twoPartTariffSupplementaryRegion = { naldRegionId: 4, chargeRegionId: 'N', displayName: 'North West' }

/**
 * When a scenario or data file needs a date safely before the sroc charging scheme came into force, we use
 * 2018-04-01 as our default — comfortably before the earliest financial year presroc supplementary billing could
 * ever need to look back to.
 * @type {string}
 */
export const presrocStartDate = '2018-04-01'

/**
 * When a scenario or data file needs the date the sroc charging scheme came into force, we use 2022-04-01 as our
 * default — the first day of the first sroc financial year (2022 to 2023).
 * @type {string}
 */
export const srocStartDate = '2022-04-01'
