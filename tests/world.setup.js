import { test as setup } from '@playwright/test'

import resetWorld from '../cli/src/world/reset.world.js'

setup('reset the world', async () => {
  await resetWorld()
})
