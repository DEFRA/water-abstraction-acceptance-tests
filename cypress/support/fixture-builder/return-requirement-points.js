export default function returnRequirements(howMany = 1) {
  const returnRequirementPoints = [
    {
      "returnRequirementId": "c33b9e4d-4d0f-4686-b1ac-6449ab014fd5",
      "pointId": "1cb602f8-6a01-4435-96b0-541e03f460da"
    },
    {
      "returnRequirementId": "35eb023b-0911-4876-9093-5f10406c4a2d",
      "pointId": "82fab927-ef31-45a2-a4e6-104315cb9764"
    }
  ]

  return {
    "returnRequirementPoints": JSON.parse(JSON.stringify(returnRequirementPoints.slice(0, howMany))),
  }
}
