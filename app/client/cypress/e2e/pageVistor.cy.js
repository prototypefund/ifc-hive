

const runTest = (name, isComonentTest = true) => {
  console.log('prepare')
  var DATA = "DATATATATAAT"
  Cypress.Commands.add('asComponentTest', (data) => { throw "BAD DEFINITION" })
  Cypress.Commands.add('context', () => { return "A" })
  window.testExecutionContex = () => { return { isComonentTest: isComonentTest } }
  var rq = require(`../../src/components/pages/${name}.component.cy.js`)

}


/*
describe("Visit Page", () => {
  it("visits the app root url dual TEST", () => {
    prepareComponent('dashboard')
    cy.asComponentTest("")
  })
})
*/
/*

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
      // cy.asComponentTest('465464')
      //prepareComponent('testboard')
      //cy.asComponentTest('999999')

      cy.log("Done")
    })

})*/

console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa')
runTest('dashboard', false)
console.log('bbbbbbbbbbbbbbbbbbbbbbbbbb')
/*
describe("Visit Page", () => {
  it.only("visits the app root url dual TEST", () => {
    cy.log('---')
  })
})*/

runTest('dashboard', true)
console.log('cccccccccccccccccccccccccc')
// cy.asComponentTest("")