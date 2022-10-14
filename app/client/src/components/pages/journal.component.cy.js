// https://docs.cypress.io/api/introduction/api.html

import { isComonentTest, isIntegrationTest } from './helper.js'


describe("Test Testborad Jornal ", () => {

  it("visit Pages/Testboard and klick value", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'))
    if (isIntegrationTest()) {
      cy.visit("/");
      cy.get('[data-test-id="sidebar_nav-app-journal"]').click()

    } else {
      cy.visitSB('pages/journal', 'Headless')
    }

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
