import { randomUUID } from 'crypto'

// Migration interface — temporary bridge while Cypress scenarios are being ported to Playwright.
//
// Cypress scenarios contain hardcoded UUIDs and externalIds. When tests run in parallel these cause
// database constraint violations, so this function rewrites them to be unique per test run.
//
// The overrides pattern also serves as a check during migration: by passing in a generated
// licenceRef and asserting against it in the test, we confirm the test is working with dynamic
// data rather than relying on hardcoded values left over from Cypress.
//
// Once all scenarios have been migrated to Playwright they will generate random values natively,
// removing the need for this function entirely. At that point the overrides pattern can also be
// dropped in favour of scenarios that already contain the values the test needs to assert against.
//
// Until then, the @example.com domain must be used for any userEmail override so the tearDown
// endpoint recognises it as acceptance test data and cleans it up between runs.
export function prepareScenario(scenario, { userEmail } = {}) {
  const naldId = _rand(10000, 99999)
  const pointId = _rand(9000000, 9999999)

  let json = JSON.stringify(scenario)

  json = _replaceUuids(json)
  json = _replaceExternalIds(json, naldId, pointId)
  json = _replaceLicenceRef(json, _generateLicenceRef())
  if (userEmail) {
    json = _replaceUserEmail(json, userEmail)
  }

  return JSON.parse(json)
}

function _generateLicenceRef() {
  return `01/${_rand(10, 99)}/${_rand(10, 99)}/${_rand(1000, 9999)}`
}

function _replaceUuids(json) {
  const uuidMap = new Map()

  return json.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, (uuid) => {
    if (!uuidMap.has(uuid)) uuidMap.set(uuid, randomUUID())
    return uuidMap.get(uuid)
  })
}

function _replaceExternalIds(json, naldId, pointId) {
  json = json.replace(/"6:1234:1:0"/g, `"6:${naldId}:1:0"`)
  json = json.replace(/"6:1234"/g, `"6:${naldId}"`)
  json = json.replace(/"9:9000090"/g, `"9:${pointId}"`)
  return json
}

function _replaceLicenceRef(json, licenceRef) {
  return json.replace(/AT\/TE\/ST\/\d+\/\d+/g, licenceRef)
}

function _replaceUserEmail(json, userEmail) {
  return json.replace(/external@example\.com/g, userEmail)
}

function _rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
