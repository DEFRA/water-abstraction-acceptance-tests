/**
 * ESM-only dependencies that we need to import in our CJS code.
 *
 * These dependencies do not support CJS modules. Until we declare `"type": "module"` in our `package.json` the project
 * is assumed to be using CJS.
 *
 * Therefore we have workaround for importing these packages using dynamic `import()`. We cannot do this at the top
 * level as Node doesn't support top level in CJS so we do it here instead.
 *
 * @module ESMImports
 */

/**
 * A collection of common interactive command line user interfaces
 *
 * @returns {Promise<object>} the prompts package
 */
export async function importPrompts () {
  const prompts = await import('@inquirer/prompts')

  return prompts
}
