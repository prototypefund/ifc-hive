// https://docs.cypress.io/api/introduction/api.html

import { isComonentTest } from './helper.js'

const runCounterTest = () => {
  for (var i = 0; i < 20; i++) {
    cy.contains("p", "click value " + i);
    cy.get('[data-test-id="testboard_count-button"]').click();
  }
}


Cypress.Commands.add('asComponentTest', (data) => {
  cy.visit('/')
  cy.log(data)

  for (const name of ['Full', 'Headless']) {
    cy.visitSB('Pages/Testboard', name)
    cy.get('[data-test-id="testboard_container"]')
    runCounterTest();
  }

})





isComonentTest() && describe("Test Testborad ", () => {
  it("visit Pages/Testboard and klick value", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'), isComonentTest())
    if (isComonentTest()) {
      for (const name of ['Full', 'Headless']) {
        cy.visitSB('Pages/Testboard', name)
        cy.get('[data-test-id="testboard_container"]')
        runCounterTest();
      }
    } else {
      cy.visit("/"); /// part of integration prep. 
      cy.get('.v-list > :nth-child(4)').click();
      runCounterTest();
    }
  });
});
