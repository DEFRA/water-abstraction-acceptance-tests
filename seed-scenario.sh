#!/bin/sh
set -eu

SCENARIOS_DIR="cypress/support/scenarios"
SEED_RUNNER="cypress/e2e/seed-runner.cy.js"

# 1. List scenarios
SCENARIOS=$(ls -1 "${SCENARIOS_DIR}"/*.js 2>/dev/null | sed 's|.*/||; s/\.js$//' | sort || true)

# 2. User selection
echo "Pick a scenario to seed:"
i=1
for name in ${SCENARIOS}; do
  printf "%2d) %s\n" "${i}" "${name}"
  i=$((i + 1))
done

printf "Enter number: "
read choice

# 3. Map selection
i=1
selected=""
for name in ${SCENARIOS}; do
  if [ "${i}" = "${choice}" ]; then
    selected="${name}"
    break
  fi
  i=$((i + 1))
done

echo "Seeding via Cypress: ${selected}"

# We set the environment variable BEFORE the npm command
# This avoids the conflict with the --env flag inside the npm script
CYPRESS_SCENARIO="${selected}" npm run cy:run:local -- --spec "${SEED_RUNNER}"
