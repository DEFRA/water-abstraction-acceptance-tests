import { defineConfig } from 'cypress'
import { readFileSync } from 'fs'
import cypressMochawesomeReporter from 'cypress-mochawesome-reporter/plugin.js'

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    setupNodeEvents (on, config) {
      // implement node event listeners here
      cypressMochawesomeReporter(on)

      // Read in environment specific config
      const text = readFileSync(`./environments/${config.env.environment}.json`)
      const environmentConfig = JSON.parse(text)

      // Apply any top level config
      config.baseUrl = environmentConfig.config.baseUrl

      // Update Cypress' environment variables by combining what it already has from the command line and any OS
      // CYPRESS_* prefixed ones, with those from our environment file
      config.env = {
        ...config.env,
        ...environmentConfig.values
      }

      // Some logic to exclude our CI test when the environment is not CI. This avoids running it or seeing it when
      // you open Cypress. It only messes up the place!
      if (config.env.environment !== 'ci') {
        config.excludeSpecPattern = ['cypress/e2e/ci.cy.js']
      } else {
        config.specPattern = ['cypress/e2e/ci.cy.js']
      }

      // IMPORTANT return the updated config object else our changes won't be applied!
      return config
    }
  },
  screenshotOnRunFailure: false,
  video: false,
  reporter: 'cypress-mochawesome-reporter'
})
