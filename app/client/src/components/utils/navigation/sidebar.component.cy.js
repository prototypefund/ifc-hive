
import { isComonentTest } from '../../pages/helper.js'


describe("Navigate True Sidebar", () => {
  it.only("visits Sidebar", () => {
    if (isComonentTest()) {
      cy.visitSB('Pages/Dashboard', 'Headless')
    } else {
      cy.visit("/");
    }

    /**
     * 
     * Wie impoprtiern der zu erwartenden Strings ? 
     */
    cy.get('[data-test-id]')
    cy.get('[data-test-id="sidebar_nav-app-settings"]').click()
    cy.get('[data-test-id="sidebar_nav-app-testboard"]').click()

    // cy.get('[data-test-id="sidebar_nav-app-daniel"]').click()
    cy.get('[data-test-id="sidebar_nav-app-journal"]').click()
    cy.get('[data-test-id="sidebar_nav-app-projects"]').click()
    cy.get('[data-test-id="sidebar_nav-app-dashboard"]').click()



    cy.contains("h1", "Dashboard - funoFun");
  });

  it("visits the app root and go to about page", () => {
    if (isComonentTest()) {
      cy.visitSB('Pages/Testboard', 'Full')
      // Wir müssen immer eine abfrage machen 
      cy.get('[data-test-id]');
    } else {
      cy.visit("/");
      cy.get('.v-list > :nth-child(4)').click();
    }

    // cy.get('')

    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();

    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.contains("p", "click value 7");
  });


  it("visits the app root url dual TEST", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'))
    if (isComonentTest()) {
      cy.visitSB('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });

});



  // cy.visit('localhost:6006/iframe.html?id=component-editperson--filled-form-2&viewMode=story')
