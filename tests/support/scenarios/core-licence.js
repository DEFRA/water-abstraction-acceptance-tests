import { readFileSync } from 'fs'

import licence from '../data/licence.js'

export const title = 'Core licence'
export const description = 'Minimal licence with a linked user account, required by most Playwright tests'

export default function () {
  try {
    return JSON.parse(readFileSync('.scenario-data.json', 'utf8'))
  } catch {
    return licence()
  }
}
