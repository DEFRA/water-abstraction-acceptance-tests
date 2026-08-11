import { readFileSync } from 'fs'

export const title = 'Sroc billing fixture'
export const description =
  'The sroc-billing fixture ported from Cypress as-is — four licences across several companies with charge versions spanning the presroc/sroc scheme boundary, plus a sent annual bill run — shared by several supplementary billing specs'

export default function () {
  return JSON.parse(readFileSync('./cypress/fixtures/sroc-billing.json', 'utf8'))
}
