import regionHelper from 'water-abstraction-engine/test/helpers/region.helper.js'
import userHelper from 'water-abstraction-engine/test/helpers/user.helper.js'

export const applications = {
  EXTERNAL: 'water_vml',
  INTERNAL: 'water_admin'
}

export const groups = {
  BILLING_AND_DATA: 'billing_and_data',
  ENVIRONMENT_OFFICER: 'environment_officer',
  NPS: 'nps',
  PSC: 'psc',
  SUPER: 'super',
  WIRS: 'wirs'
}

/**
 * When a scenario or data file needs a password, we use P@55word as our default.
 * @type {string}
 */
export const password = 'P@55word'

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

export const users = {
  BASIC: userHelper.select(10),
  BILLING_AND_DATA: userHelper.select(4),
  PSC: userHelper.select(5)
}
