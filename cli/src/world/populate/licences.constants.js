import { regions } from '../../../../tests/support/default-values.js'

/**
 * How many licences of each group to add for each region
 *
 * The groups are by how often a kind of licence is seen. A region's total is in proportion to its size, and is split
 * between the groups the same way in every region.
 */
export const REGIONS = [
  { region: regions.ANGLIAN, common: 273, fairlyCommon: 92, uncommon: 128, rare: 61, veryRare: 3 },
  { region: regions.MIDLANDS, common: 215, fairlyCommon: 72, uncommon: 101, rare: 48, veryRare: 2 },
  { region: regions.SOUTH_WEST, common: 156, fairlyCommon: 53, uncommon: 73, rare: 35, veryRare: 1 },
  { region: regions.NORTH_EAST, common: 124, fairlyCommon: 42, uncommon: 58, rare: 28, veryRare: 2 },
  { region: regions.NORTH_WEST, common: 81, fairlyCommon: 27, uncommon: 38, rare: 18, veryRare: 2 },
  { region: regions.THAMES, common: 64, fairlyCommon: 22, uncommon: 30, rare: 14, veryRare: 1 },
  { region: regions.SOUTHERN, common: 44, fairlyCommon: 15, uncommon: 21, rare: 10, veryRare: 1 },
  { region: regions.WALES, common: 27, fairlyCommon: 9, uncommon: 12, rare: 6, veryRare: 1 }
]

// How often a licence is held by a water company. Every 24th licence in a region is, starting with its first.
// This is just an arbitrary way of adding multiple licences to a water company.
export const WATER_COMPANY_EVERY = 24

// Licences that started before this date have a first licence version with an issue of 100. Those that started on or
// after it have one with an issue of 1.
export const ISSUE_100_BEFORE = '2000-01-01'

// The dates the licences start on. Each licence takes the next one, going back to the start of the list when it runs
// out.
//
// About half of all licences started in the 1960s, so about half of the dates are. The rest are shared between the
// decades since in proportion. The list is a different length to any of the groups of licences, so a kind of licence
// is not always given the same start dates.
export const START_DATES = [
  '1965-04-01',
  '1972-04-01',
  '1966-04-01',
  '1994-04-01',
  '1963-04-01',
  '1985-04-01',
  '1967-04-01',
  '2004-04-01',
  '1961-04-01',
  '2013-04-01',
  '1968-04-01',
  '1991-04-01',
  '1964-04-01',
  '1978-04-01',
  '1969-04-01',
  '2022-04-01',
  '1962-04-01',
  '1988-04-01',
  '1960-04-01',
  '2008-04-01',
  '1965-04-01',
  '1997-04-01',
  '2017-04-01'
]

// The purposes the licences are used for. Each licence takes the next one, going back to the start of the list when it
// runs out.
//
// About two thirds of licences are not two-part tariff, so about two thirds of the purposes are make-up or top up water
// (280), which is not. The rest are spray irrigation direct (400), which is. The list is a different length to the
// start dates and to any of the groups of licences, so a kind of licence is not always given the same purpose.
export const PURPOSES = ['280', '280', '400', '280', '280', '400', '280', '400', '280', '280', '400']

// How many years after they started the licences that have ended were held for, by how they ended. Each licence takes
// the next one in the list for how it ended, going back to the start of the list when it runs out. A licence that has
// not ended does not use the one it takes.
//
// A licence that expired was mostly held for about ten years. One that lapsed or was revoked was often held for
// decades. Where a licence started too recently to have been held for the number of years it takes, it uses the next
// one in the list that fits. Each list is a different length to the start dates and any of the groups of licences, so a
// kind of licence does not always end at the same time.
export const YEARS_HELD = {
  expired: [9, 5, 11, 2, 15, 7, 10],
  lapsed: [23, 10, 34, 3, 39, 16, 28],
  revoked: [14, 5, 28, 2, 40, 9, 20]
}

// The date many licences were revoked on. Two of every three licences that were revoked, and that started long enough
// before it, are revoked on this date rather than a number of years after they started.
export const REVOKED_ON = '2005-03-31'

// The abstraction periods the licences abstract during. Each licence takes the next one, going back to the start of the
// list when it runs out.
//
// About a third of licences abstract all year, 1 January to 31 December, so about a third of the periods are. About a
// quarter are 1 April to 31 March. The rest are shared between the summer and winter periods. The list is a different
// length to the start dates, the purposes and any of the groups of licences, so a kind of licence is not always given
// the same abstraction period.
export const ABSTRACTION_PERIODS = [
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 10 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 4, endDay: 30, endMonth: 9 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 11, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 10 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 3, endDay: 31, endMonth: 10 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 4, endDay: 30, endMonth: 9 },
  { startDay: 1, startMonth: 4, endDay: 31, endMonth: 3 },
  { startDay: 1, startMonth: 1, endDay: 31, endMonth: 12 },
  { startDay: 1, startMonth: 5, endDay: 30, endMonth: 9 }
]

// The quantities the licences can abstract up to: in a year, a day and an hour in cubic metres, and in an instant in
// litres per second. Each licence takes the next one for its first purpose, and the ones after it for any other
// purposes it has, going back to the start of the list when it runs out.
//
// A purpose nearly always has an annual and a daily quantity. About half have an hourly and an instant quantity too,
// and the rest are missing one or both. Most annual quantities are between 1,000 and 100,000, with a few smaller and a
// few much larger. The list is a different length to the start dates, the purposes, the abstraction periods and any of
// the groups of licences, so a kind of licence is not always given the same quantities.
export const QUANTITIES = [
  { annual: 20000, daily: 432, hourly: 36, instant: 10 },
  { annual: 4546, daily: 45.46, hourly: null, instant: null },
  { annual: 250000, daily: 2400, hourly: 100, instant: null },
  { annual: 10000, daily: 200, hourly: 18, instant: 5 },
  { annual: 2273, daily: 22.7, hourly: 2.3, instant: null },
  { annual: 50000, daily: 1080, hourly: 90, instant: 25 },
  { annual: 500, daily: 5, hourly: null, instant: null },
  { annual: 22730, daily: 545.5, hourly: null, instant: 12.6 },
  { annual: 5000, daily: 60, hourly: 7.2, instant: 2 },
  { annual: 2000000, daily: 9600, hourly: 400, instant: 111.1 },
  { annual: 9092, daily: 90.9, hourly: null, instant: null },
  { annual: 30000, daily: 648, hourly: 54, instant: 15 },
  { annual: 600000, daily: 3600, hourly: 150, instant: null }
]

// How many points the licences abstract from. Each licence takes the next one, going back to the start of the list when
// it runs out.
//
// Most licences abstract from one point. About one in ten abstract from two, and a few from more. The list is a
// different length to the other lists and any of the groups of licences, so a kind of licence does not always have the
// same number of points.
export const POINTS = [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 2, 1, 1]
