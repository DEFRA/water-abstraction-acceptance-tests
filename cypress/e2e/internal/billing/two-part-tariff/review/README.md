# Two-Part Tariff Engine Acceptance Tests

## Overview

- [Two-part tariff Jira Epic for acceptance tests](https://eaflood.atlassian.net/browse/WATER-4450)

- [Two-part tariff Jira Epic for bill run engine](https://eaflood.atlassian.net/browse/WATER-4057)

This README provides an overview of the acceptance test scenarios for the Two-Part Tariff (2PT) Engine. The 2PT Engine matches charge elements from water abstraction licences with their customer returns, allocating the returned quantities to the charge elements for billing purposes. The charge references and elements it considers are only those flagged as being 2pt. The returns are matched to the elements based on their purpose. Each scenario described here aims to validate specific functionalities and behaviors of the 2PT Engine, ensuring it operates as expected under various conditions.

## Scenarios

### Scenario 1: Simple Licence & Returns with No Issues

- **Description**: The simplest test case with a single charge element and matching return, fully allocated without issues.
- **Acceptance Criteria**:
  - No issues are reported on the licence, the returns or the charging information.
  - The return fully allocates to the charge element.

### Scenario 2: Simple Licence with Only Some 2PT Charge Elements and Returns

- **Description**: Similar to Scenario 1 but includes a non-2PT charge element and return to verify only 2PT elements and returns are considered.
- **Acceptance Criteria**:
  - No issues are reported on the licence, the returns or the charging information.
  - The return fully allocates to the charge element.

### Scenario 3: A Licence with Late Returns

- **Description**: Tests how the engine flags late returns without blocking allocation.
- **Acceptance Criteria**:
  - Filter by late returns issue on review page
  - Licence has a ‘Returns received late’ issue flagged
  - The return still allocates fully to the element

### Scenario 4: A Licence with an Aggregate

- **Description**: Tests flagging and handling of licences with aggregate values not equal to 1.
- **Acceptance Criteria**:
  - Filter by aggregate issue on review page
  - Licence has an ‘Aggregate’ issue flagged
  - Licence status is ’review’
  - The return still allocates fully to the element
  - Charge Reference details link test ‘Change details’
  - Amend the aggregate value and charge adjustment value and check the pages display updated values
  - Remove aggregate and charge adjustment value and check link is still displayed to amend them

### Scenario 5: Return that Overlaps on the Charge Dates

- **Description**: Tests flagging of returns that overlap charge dates and verifies correct allocation.
- **Acceptance Criteria**:
  - Filter by overlap of charge dates issue on review page
  - Licence has an ‘Overlap of charge dates’ issue flagged
  - Licence status is ’review’
  - The return still allocates fully to the element

### Scenario 6: Returns that Are Under Query

- **Description**: Ensures returns under query are flagged and not allocated until user intervention.
- **Acceptance Criteria**:
  - Filter by under query issue on review page
  - Licence has an ‘Under query’ issue flagged
  - Licence has an ‘Over abstracted’ issue flagged (When a return is under query we don't expect the engine to allocate any of its quantities, this will therefore also mark the return as having the issue 'Over abstracted')
  - Licence status is ’review’
  - The return does not allocate to the element

### Scenario 7: Returns Received but Not Processed

- **Description**: Tests flagging of returns received but not processed and prevents their allocation.
- **Acceptance Criteria**:
  - Filter by return received but not processed issue on review page
  - Licence has a ‘returns received but not processed’ issue flagged
  - Licence has an ‘Over abstracted’ issue flagged (When a return status is received we don't expect the engine to allocate any of its quantities, this will therefore also mark the return as having the issue 'Over abstracted')
  - Licence status is ’review’
  - The return does not allocate to the element

### Scenario 8: A Licence with Nil Returns

- **Description**: Verifies that nil returns do not allocate quantities and no issues are flagged.
- **Acceptance Criteria**:
  - Licence has no issues flagged
  - Licence status is ’ready’
  - Nothing is allocated to the charge element or reference

### Scenario 9: A Licence Without Return Submissions

- **Description**: Tests handling of licences with no return submissions and verifies correct flagging and allocation.
- **Acceptance Criteria**:
  - Filter by no returns received issue on review page
  - Licence has a ‘No returns received’ issue flagged
  - Licence has a ‘Some returns not received’’ issue flagged
  - Both the issues on the licence are a status 'ready', putting the overall licence status as ready
  - Both charge elements get allocated amounts

### Scenario 10: A Licence with No Matching Returns

- **Description**: Ensures charge elements have no allocated quantity when there are no matching returns and flags appropriately.
- **Acceptance Criteria**:
  - Filter by unable to match returns issue on review page
  - Licence has an ‘Unable to match return’ issue flagged
  - Licence status is ’review’
  - Nothing is allocated on the charge element

### Scenario 11: Returns that Abstracted Outside the Charge Period and Over Abstraction

- **Description**: Tests flagging and partial allocation for returns abstracted outside the charge period and over abstraction.
- **Acceptance Criteria**:
  - Filter by abstracted outside period issue on review page
  - Licence has an ‘Abstracted outside period’ and ‘over abstracted’ issue flagged
  - Licence should be a 'ready' status since none of the issues have a 'review' status
  - The over-abstracted volumes are not allocated on the charge elements.

### Scenario 12: Returns that Are Split Over Charge References

- **Description**: Verifies allocation and flagging when returns are split over multiple charge references.
- **Acceptance Criteria**:
  - Filter by split over charge reference issue on review page
  - Licence has a ‘Split over charge reference’ issue flagged
  - Licence status is ’review’
  - The charge reference with the highest subsistence charge is fully allocated
  - The charge reference with the lower subsistence charge still has unallocated volume.

### Scenario 13: Returns that Don’t Match a Charge Element

- **Description**: Ensures no allocation and proper flagging for returns that do not match any charge elements.
- **Acceptance Criteria**:
  - Filter by unable to match return issue on review page
  - Licence has an ‘Unable to match return’ issue flagged
  - Licence has an 'Over abstracted' issue flagged (When a return doesn't match to a charge element any abstracted volumes  on the return is considered over abstraction. This means that the licence will have 'multiple issues' flagged when a return hasn't matched.)
  - Licence status is ’review’
  - The unmatched return is in its own unmatched returns table
  - Nothing is allocated on the charge element

### Scenario 14: Allocation of Returns to Charge Elements by Authorised Amounts

- **Description**: Demonstrates allocation of returns to charge elements based on authorised volumes, ensuring correct prioritisation.
- **Acceptance Criteria**:
  - No issues are reported on the licence, the returns or the charging information.
  - Licence status is ’ready’
  - The charge element with the highest authorised volume is fully allocated
  - The second charge element is only partially allocated

## Conclusion

These scenarios provide comprehensive coverage of the key functionalities and potential edge cases of the Two-Part Tariff Engine. By running these acceptance tests, we aim to ensure the robustness and reliability of the engine, providing confidence that it will perform correctly in real-world scenarios.
