
import { isComonentTest } from '../../pages/helper.js'


describe("Navigate True Sidebar", () => {
  it("visits Sidebar", () => {
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Full')
      cy.get('[data-test-id]');
    } else {
      cy.visit("/");
      cy.get('[data-test-id]');
      /**
       *  
       * Wie impoprtiern der zu erwartenden Strings ? 
       */
      cy.get('[data-test-id="sidebar_nav-app-settings"]').click()
      cy.get('[data-test-id="sidebar_nav-app-testboard"]').click()
      cy.get('[data-test-id="sidebar_nav-app-journal"]').click()
      cy.get('[data-test-id="sidebar_nav-app-projects"]').click()
      cy.get('[data-test-id="sidebar_nav-app-dashboard"]').click()
    }

  });



  it("visits the app root url dual TEST", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'))
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });

});



  // cy.visit('localhost:6006/iframe.html?id=component-editperson--filled-form-2&viewMode=story')
