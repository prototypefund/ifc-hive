// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("visits the app root url dual TEST", () => {
    cy.log("Server Contex", Cypress.env('SERVER'))
    if (Cypress.env('SERVER') == 'SB') {
      cy.visit("iframe.html?id=pages-dashboard--headless");
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    // http://localhost:7007/iframe.html?id=pages-dashboard--headless
    // http://localhost:7007/?path=/story/pages-dashboard--headless
    cy.contains("h1", "Dashboard - funoFun");
  });

  it("visits the app root and go to about page", () => {
    cy.visit("/");
    cy.log("Server Contex", Cypress.env('SERVER'))
    if (Cypress.env('SERVER') == 'SB') {
      cy.log('Sadsaf')
      cy.visit("iframe.html?id=pages-testboard--full");
      // Wir müssen immer eine abfrage machen 
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
      cy.get('.v-list > :nth-child(4)').click();
    }

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
    cy.log("Server Contex", Cypress.env('SERVER'))
    if (Cypress.env('SERVER') == 'SB') {
      cy.visit("iframe.html?id=pages-dashboard--headless");
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    // http://localhost:7007/iframe.html?id=pages-dashboard--headless
    // http://localhost:7007/?path=/story/pages-dashboard--headless
    cy.contains("h1", "Dashboard - funoFun");
  });
});



  // cy.visit('localhost:6006/iframe.html?id=component-editperson--filled-form-2&viewMode=story')
