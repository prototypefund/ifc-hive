
//import { isComonentTest } from './helper.js'

/*
 * http://localhost:7007/iframe.html?id=pages-dashboard--headless
 * http://localhost:7007/?path=/story/pages-dashboard--headless
 */

const _isComonentTest = window.testExecutionContex().isComonentTest;
// const isComonentTest = () => { return _isComonentTest }
const isComonentTest = () => { return window.testExecutionContex().isComonentTest }

console.log('IMPORT', window.testExecutionContex())
console.log('IMPORT', _isComonentTest)

Cypress.Commands.add('asComponentTest', (data) => {
  cy.visit('/')
  cy.log(data)

  if (isComonentTest()) {
    cy.visitSB('Pages/Dashboard', 'Headless')
    cy.get('[data-test-id]')
  } else {
    cy.visit("/");
  }

  cy.contains("h1", "Dashboard - funoFun");

})


describe("Dash Board My First Test " + isComonentTest(), () => {

  it("visits the app root url dual TEST 1", () => {
    cy.log(isComonentTest())

    if (isComonentTest()) {
      cy.visitSB('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });


  it("visits the app root url dual TEST 2", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'))
    cy.log("Server Contex isComonentTest", _isComonentTest, window.testExecutionContex.isComonentTest)
    if (isComonentTest()) {
      cy.visitSB('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });

});


/*
  // cy.visit('localhost:6006/iframe.html?id=component-editperson--filled-form-2&viewMode=story')
*/