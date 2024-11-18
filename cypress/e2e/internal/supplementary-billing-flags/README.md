# Supplementary Billing Flags Acceptance Tests

## Overview

- [Supplementary Billing Flags clean up ticket](https://eaflood.atlassian.net/browse/WATER-4746)

This README outlines the acceptance test scenarios for supplementary billing flags.

### What Are Supplementary Billing Flags?

When changes are made to a licence's details after the annual bill has been issued, these changes need to be reflected in a supplementary bill run. This ensures the bill is adjusted to reflect the updated licence information, resulting in either a credit or an additional charge.

Supplementary billing flags indicate that a licence needs to be included in a supplementary bill run due to changes.

There are three types of flags:
- **Pre-SROC**: Covers changes before the implementation of the SROC (1st April 2022).
- **SROC**: Covers changes after SROC implementation.
- **Two-Part Tariff Years**: Flags specific years requiring rebilling, recorded in the `LicenceSupplementaryYears` table.

The **Pre-SROC** and **SROC** flags apply to the whole licence, while **Two-Part Tariff** flags apply to specific years. Each type of flag determines which supplementary bill run will pick up the changes.

### What Triggers a Supplementary Billing Flag?

A licence will be flagged for rebilling when one of the following changes occurs:

- Deleting a record from the workflow.
- Cancelling a charge version waiting for approval.
- Approving a new charge version.
- Editing a return.
- Removing a licence from a bill run.
- Using the "Recalculate Bills" option in the licence setup tab.
- Ending a licence.
- Adding a new charging agreement.
- Ending a charging agreement.
- Deleting a charging agreement.

These flags ensure only licences with changes are included in supplementary bill runs.
To test if the flag has been correctly added to a licence, we compare the banner displayed at the top of the licence page. This banner appears whenever a licence has been flagged for supplementary billing.

## Testing Scenarios

### Setting/Ending/Deleting a licence agreement
- **Description**: Acceptance tests for setting/ending/deleting a licence agreement already exists (cypress/e2e/internal/licence-agreements). These tests has been updated to include checking the content of the supplementary billing flag banner.
- **Acceptance Criteria**:
  - Flags are added for pre-SROC supplementary billing.

### Scenario 1: Editing a return
- **Description**: Editing a submitted return brings the user to a confirmation page where they can manually flag the return for supplementary billing. The service determines which flags to add based on the return's dates and whether it is for a two-part tariff.
- **Acceptance Criteria**:
  - Flags are added for pre-SROC, SROC, and two-part tariff supplementary billing.

### Scenario 2: Recalculate bills link
- **Description**: The recalculate bills link is available on the licence setup tab for licences with a two-part tariff charging agreement. Clicking this link allows the user to flag individual years (up to six years in the past). Years before 1st April 2022 are bundled into a pre-SROC button. The user can flag multiple years in one action.
- **Acceptance Criteria**:
  - Flags are added for pre-SROC and two-part tariff supplementary billing.

### Scenario 3: Deleting a licence from workflow
- **Description**: Licences in workflow cannot be included in any bill run. When a user removes a licence from workflow, the service checks if any annual bill runs occurred while the licence was in workflow. Based on this, the licence is flagged as needed. Pre-SROC flags are not added due to the prevalence of £0 bill runs.
- **Acceptance Criteria**:
  - Flags are added for SROC and two-part tariff supplementary billing.

### Scenario 4: Cancelling a charge version that is waiting for approval
- **Description**: When a charge version is awaiting approval, the licence is in workflow and excluded from bill runs. If a user cancels the charge version, it effectively removes the licence from workflow. The service checks whether any annual bill runs have occurred for the licence’s region and flags the licence accordingly.

- **Acceptance Criteria**:
  - Flags are added for SROC and two-part tariff supplementary billing.

### Scenario 5: Approving a charge version
- **Description**: Approving a new charge version indicates a change to the charging information. The service determines if supplementary billing is needed based on the charge version’s dates. Future-dated charge versions are excluded from supplementary billing runs, while past-dated ones are flagged as required.
- **Acceptance Criteria**:
  - Flags are added for pre-SROC, SROC, and two-part tariff supplementary billing.

### Scenario 6: Removing a licence from a bill run
- **Description**: Users can remove licences from any annual bill run. If this happens, the licence is flagged for supplementary billing for the same year to ensure it is billed correctly.
- **Acceptance Criteria**:
  - Flags are added for pre-SROC, SROC, and two-part tariff supplementary billing.

## Conclusion
The only scenario not covered by the acceptance tests is when a licence ends as part of the overnight licence import process. Since the import runs automatically overnight, it cannot be tested directly.

However, the acceptance tests cover all other key functionalities of the flagging service. These tests are designed to reflect real-world scenarios and ensure the flagging service operates reliably. By running these tests, we can verify the system handles changes accurately and flags licences appropriately for supplementary billing.
