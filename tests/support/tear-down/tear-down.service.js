/**
 * Removes all data created for acceptance tests
 * @module TearDownService
 */

import CrmSchemaService from './crm-schema.service.js'
import IdmSchemaService from './idm-schema.service.js'
import PermitSchemaService from './permit-schema.service.js'
import ReturnsSchemaService from './returns-schema.service.js'
import WaterSchemaService from './water-schema.service.js'

/**
 * Removes all data created for acceptance tests
 */
export default async function tearDownService() {
  await Promise.all([CrmSchemaService(), IdmSchemaService(), PermitSchemaService(), ReturnsSchemaService()])

  return await WaterSchemaService()
}
