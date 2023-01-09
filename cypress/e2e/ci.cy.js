'use strict'

describe('CI', () => {
  it('confirms we have not broken the build', () => {
    // This is taken from our other Cypress projects, which are [cucumber](https://cucumber.io/) based. Just in case
    // you were wondering on why the fascination with cucumbers!
    cy.wrap({ color: 'green', size: 30 }).as('cucumber')

    cy.get('@cucumber').then((cucumber) => {
      cy.wrap(
        [{ color: 'green', size: cucumber.size / 2 }, { color: 'green', size: cucumber.size / 2 }]
      ).as('choppedCucumbers')
    })

    cy.get('@choppedCucumbers').then((choppedCucumbers) => {
      expect(choppedCucumbers).to.have.lengthOf(2)

      choppedCucumbers.forEach((cucumber) => {
        expect(cucumber.size).to.equal(15)
      })
    })
  })
})
