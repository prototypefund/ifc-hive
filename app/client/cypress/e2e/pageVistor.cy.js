


// import '../../src/components/pages/dashboard.component.cy.js'




const prepareComponent = (name) => {
  console.log('prepare')
  var DATA = "DATATATATAAT"
  Cypress.Commands.add('asComponentTest', (data) => { throw "BAD DEFINITION" })
  require(`../../src/components/pages/${name}.component.cy.js`)

}

describe("Visit Page", () => {
  beforeEach(() => {
    cy.fixture('visit.json').as('visitPage')
  }),
    it("visits the app root url dual TEST", () => {

      cy.get('@visitPage').then(
        x => {
          cy.log(x)
        }
      );

      prepareComponent('dashboard')
      cy.asComponentTest('465464')
      // prepareComponent('testboard')
      // cy.asComponentTest('999999')


      cy.log("Done")
    })

})