// https://docs.cypress.io/api/introduction/api.html

import {isComonentTest, getURL} from './helper.js'


describe("Test Testborad Jornal ", () => {

  it.only("visit Pages/Testboard and klick value", () => {
    cy.visit("/");
    cy.log("Server Contex", Cypress.env('TESTTYPE'), isComonentTest())
    
    cy.visit(getURL('pages/journal', 'Headless'))
    cy.get('[data-test-id="jornal_container"]')


    cy.get('.v-timeline-item__body')
      .filter(':contains("Mustermann")')
      .should('contain', 'Meilenstein')

    cy.get('.v-timeline-item__body')
      .filter(':contains("Mustermann")')
      .each(element => {
        cy.wrap(element).should('contain', 'Planung')
      });
  

  });
  
});
