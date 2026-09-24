import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import dataWorld from '../src/world/data.world.js'
import protectWorld from '../src/world/protect.world.js'

describe('protectWorld', () => {
  describe('when given the real scenarios', () => {
    it('does not find any duplicate bill run combinations', async () => {
      const scenarios = await dataWorld()

      assert.doesNotThrow(() => {
        protectWorld(scenarios)
      })
    })
  })
})
