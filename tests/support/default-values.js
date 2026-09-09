import regionHelper from 'water-abstraction-engine/test/helpers/region.helper.js'

/**
 * When a scenario or data file needs a password, we use P@55word as our default.
 * @type {string}
 */
export const password = 'P@55word'

/**
 * When a scenario or data file needs a date safely before the sroc charging scheme came into force, we use
 * 2018-04-01 as our default — comfortably before the earliest financial year presroc supplementary billing could
 * ever need to look back to.
 * @type {string}
 */
export const presrocStartDate = '2018-04-01'

export const regions = {
  ANGLIAN: regionHelper.select(0),
  MIDLANDS: regionHelper.select(1),
  NORTH_EAST: regionHelper.select(2),
  NORTH_WEST: regionHelper.select(3),
  SOUTH_WEST: regionHelper.select(4),
  SOUTHERN: regionHelper.select(5),
  THAMES: regionHelper.select(6),
  WALES: regionHelper.select(7)
}

/**
 * When a scenario or data file needs the date the sroc charging scheme came into force, we use 2022-04-01 as our
 * default — the first day of the first sroc financial year (2022 to 2023).
 * @type {string}
 */
export const srocStartDate = '2022-04-01'
