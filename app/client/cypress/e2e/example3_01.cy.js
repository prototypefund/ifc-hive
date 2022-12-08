// https://docs.cypress.io/api/introduction/api.html

import { isComonentTest } from '../support/sbHelper.js';

describe("My First Test", () => {
  it("visits the app root url dual TEST", () => {
    cy.log("Server Contex", Cypress.env('SERVER'))
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Headless')
      //      cy.visit("iframe.html?id=pages-dashboard--headless");
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });

  it("visits the app root and go to about page", () => {
    if (isComonentTest()) {
      cy.visitStorybook('Pages/testboard', 'Full')
    } else {
      cy.visit("/testboard");
    }
    for (let i = 0; i < 7; i++) {
      // Button ADDCOUNT
      cy.get('.mb-10 > .v-btn').click();
    }
    cy.contains("p", "click value 7");
  });

  it("visits the app root url dual TEST", () => {
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Headless')
    } else {
      cy.visit("/dashboard");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });
});
