
import { isComonentTest } from './helper.js'


describe("My First Test", () => {
  it("visits the app root url dual TEST", () => {
    if (isComonentTest()) {
      cy.visitSB('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    // http://localhost:7007/iframe.html?id=pages-dashboard--headless
    // http://localhost:7007/?path=/story/pages-dashboard--headless
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
