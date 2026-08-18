/**
 * When a scenario or data file needs an account number, we use S99999991A as our default.
 * @type {string}
 */
export const accountNumber = 'S99999991A'

/**
 * When a scenario or data file needs a company name, we use Big Farm Co Ltd as our default.
 * @type {string}
 */
export const companyName = 'Big Farm Co Ltd'

/**
 * When a scenario or data file needs an external user email, we use external@example.com as our default.
 * @type {string}
 */
export const externalUserEmail = 'external@example.com'

/**
 * When a scenario or data file needs an internal user email, we use regression.tests@wrls.gov.uk as our default.
 * @type {string}
 */
export const internalUserEmail = 'regression.tests@wrls.gov.uk'

/**
 * When a scenario or data file needs a licence reference, we use AT/TE/ST/01/01 as our default.
 * @type {string}
 */
export const licenceRef = 'AT/TE/ST/01/01'

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

/**
 * All tests use the region code 9, the teardown uses this region code to delete test data
 * @type {number}
 */
export const regionCode = 9

/**
 * When a scenario or data file needs the date the sroc charging scheme came into force, we use 2022-04-01 as our
 * default — the first day of the first sroc financial year (2022 to 2023).
 * @type {string}
 */
export const srocStartDate = '2022-04-01'
