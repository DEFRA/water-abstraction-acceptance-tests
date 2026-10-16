# Billing

Billing specs run in parallel against one shared world, seeded once before any spec runs. A bill run belongs to a region, and the service only allows one bill run of a type per region and financial year, so each spec that creates abill run has its own region.

We can find rows on the bill runs page with `findBillRunRow()` from `tests/support/helpers/bill-run.helpers.js` rather than by position, because other specs' bill runs appear in the same list.

Every region has an annual bill run created today:

- 5 are seeded by scenarios (South West, Thames, Southern, North East and North West). North East's is for the previous financial year, not the current one
- 3 are created by specs (Anglian, Midlands and Wales).

Anything the service decides from region-wide bill runs will see them, for example cancelling a workflow flags the licence for sroc supplementary billing when an annual bill run in its region was created after the workflow.

`protectWorld()` in `cli/src/world/protect.world.js` stops two scenarios seeding a bill run for the same type, region and financial year. It can't see bill runs that specs create through the UI, so check which region a spec uses before adding one.
