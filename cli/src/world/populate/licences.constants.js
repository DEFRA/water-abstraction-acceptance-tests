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
// About two thirds of licences are not two-part tariff, so about two thirds of the purposes are general farming and
// domestic (140), which is not. The rest are spray irrigation direct (400), which is. The list is a different length to
// the start dates and to any of the groups of licences, so a kind of licence is not always given the same purpose.
export const PURPOSES = ['140', '140', '400', '140', '140', '400', '140', '400', '140', '140', '400']

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

// How often a live licence is tagged to a monitoring station. Every 6th live licence is, starting with its first.
//
// Only a few licences are tagged, and nearly all of them are live.
export const MONITORING_STATION_EVERY = 6

// The monitoring stations the tagged licences are tagged to, and how many tagged licences each one has. The tagged
// licences take them in order, going back to the start of the list when it runs out. A station is picked by its place
// in the monitoring stations the engine seeds, missing the first few which the specs use.
//
// Most stations have one or a few licences tagged to them, and a few have many.
export const MONITORING_STATIONS = [
  { station: 10, licences: 21 },
  { station: 11, licences: 8 },
  { station: 12, licences: 7 },
  { station: 13, licences: 3 },
  { station: 14, licences: 3 },
  { station: 15, licences: 3 },
  { station: 16, licences: 3 },
  { station: 17, licences: 3 },
  { station: 18, licences: 2 },
  { station: 19, licences: 2 },
  { station: 20, licences: 2 },
  { station: 21, licences: 2 },
  { station: 22, licences: 2 },
  { station: 23, licences: 1 },
  { station: 24, licences: 1 },
  { station: 25, licences: 1 },
  { station: 26, licences: 1 },
  { station: 27, licences: 1 },
  { station: 28, licences: 1 },
  { station: 29, licences: 1 },
  { station: 30, licences: 1 },
  { station: 31, licences: 1 },
  { station: 32, licences: 1 },
  { station: 33, licences: 1 },
  { station: 34, licences: 1 },
  { station: 35, licences: 1 }
]

// How many times a tagged licence is tagged to its monitoring station. Each tagged licence takes the next one, going
// back to the start of the list when it runs out.
//
// Most are tagged once. Some are tagged twice, and a few three times.
export const TAGS_PER_LICENCE = [1, 1, 2, 1, 1, 3, 1, 2, 1, 1]

// The tags. Each tag takes the next one, going back to the start of the list when it runs out.
//
// Most tags measure flow and the rest measure level. Most stop abstraction, and a few reduce it or do either, whatever
// they measure. About two thirds are linked to a cessation condition on the licence, and the rest have their own
// abstraction period. Most have last been sent a resume alert, some a stop alert, and a few a warning or reduce alert.
// A stop alert is only sent for a tag that stops abstraction, and a reduce alert for one that reduces it. The list is a
// different length to the tags per licence, so a licence is not always given the same kinds of tag.
export const TAGS = [
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 83.8,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: true,
    status: 'stop'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 26.4,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'level',
    restrictionType: 'stop',
    thresholdUnit: 'SLD',
    thresholdValue: 99.45,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'l/s',
    thresholdValue: 300,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'reduce',
    thresholdUnit: 'm3/s',
    thresholdValue: 3.68,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 428.1,
    linkedCondition: true,
    status: 'stop'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/d',
    thresholdValue: 45460,
    linkedCondition: true,
    status: 'warning'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop_or_reduce',
    thresholdUnit: 'Ml/d',
    thresholdValue: 83.8,
    linkedCondition: true,
    status: 'reduce'
  },
  {
    measureType: 'level',
    restrictionType: 'reduce',
    thresholdUnit: 'mAOD',
    thresholdValue: 2,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'l/s',
    thresholdValue: 108.75,
    linkedCondition: false,
    status: 'stop'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 83.8,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 26.4,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'level',
    restrictionType: 'stop_or_reduce',
    thresholdUnit: 'mBOD',
    thresholdValue: 0.75,
    linkedCondition: true,
    status: 'reduce'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: false,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'l/s',
    thresholdValue: 300,
    linkedCondition: true,
    status: 'stop'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'Ml/d',
    thresholdValue: 83.8,
    linkedCondition: true,
    status: 'resume'
  },
  {
    measureType: 'flow',
    restrictionType: 'stop',
    thresholdUnit: 'm3/s',
    thresholdValue: 1.3,
    linkedCondition: true,
    status: 'resume'
  }
]
