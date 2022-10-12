// https://docs.cypress.io/api/introduction/api.html

import {isComonentTest, getURL} from './helper.js'


const prepareTestBord = (Type) => {
  cy.visit(getURL('Pages/Testboard', Type))
  // Wir müssen immer eine abfrage machen 
  cy.get('[data-test-id="testboard_container"]')
};

const runCounterTest = () => {
  for(var i=0; i < 20; i++) {
    cy.contains("p", "click value "+i);
    cy.get('[data-test-id="testboard-count-button"]').click();
  }
}


describe("Test Testborad ", () => {
  it("visit Pages/Testboard and klick value", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'), isComonentTest())
    if (isComonentTest()) {
      for(const name of ['Full', 'Headless']) {
        prepareTestBord(name)
        runCounterTest();
      }
    } else {
      cy.visit("/");
      cy.get('.v-list > :nth-child(4)').click();   
      runCounterTest();
    }
  });
});
