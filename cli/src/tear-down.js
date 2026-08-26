import { logInfo } from './log.lib.js'
import tearDownService from '../../tests/support/tear-down/tear-down.service.js'

/**
 * Tear down all test data. Does not load anything afterwards
 */
export async function tearDown() {
  logInfo('Tearing down test data...')

  await tearDownService()
}
