export default function returnVersion (howMany = 1) {
  const returnVersions = [
    {
      id: 'bcd4e8c7-16ed-419c-915d-d8f184e45ed5',
      version: 101,
      startDate: '2020-01-01',
      endDate: null,
      status: 'current',
      externalId: '6:9999990',
      licenceId: '8717da0e-28d4-4833-8e32-1da050b60055'
    }
  ]

  return {
    returnVersions: returnVersions.slice(0, howMany)
  }
}
