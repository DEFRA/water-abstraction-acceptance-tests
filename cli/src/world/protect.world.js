/**
 *
 * @param scenarios
 */
export default function protectWorld(scenarios) {
  const seenCombos = new Map()
  const errors = []

  for (const [key, scenarioData] of Object.entries(scenarios)) {
    if (Array.isArray(scenarioData.billRuns)) {
      for (const billRun of scenarioData.billRuns) {
        const region = billRun.regionId?.value
        const year = billRun.toFinancialYearEnding
        const batchType = billRun.batchType

        const combo = `${batchType}-${region}-${year}`

        if (seenCombos.has(combo)) {
          const originalScenario = seenCombos.get(combo)
          errors.push(
            `• [Batch Type: ${batchType} | Region: ${region} | Year: ${year}] ` +
              `found in scenario '${key}' (already used in '${originalScenario}')`
          )
        } else {
          seenCombos.set(combo, key)
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Found ${errors.length} duplicate bill run combination(s):\n${errors.join('\n')}`)
  }
}
