import usersData from './users.data.js'

export default function (licenceData) {
  const {
    licences: [licence]
  } = licenceData

  return {
    workflows: [
      {
        licenceId: licence.id,
        status: 'review',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: {
          email: usersData.billingAndData
        },
        data: {
          chargeVersion: {
            scheme: 'sroc',
            status: 'draft',
            dateRange: {
              startDate: licence.startDate
            },
            changeReason: {
              id: 'db22c827-c74d-40d9-aab8-282fd9843933',
              type: 'new_non_chargeable_charge_version',
              description: 'Aggregate licence',
              triggersMinimumCharge: false,
              isEnabledForNewChargeVersions: true
            },
            chargeElements: []
          }
        }
      }
    ]
  }
}
