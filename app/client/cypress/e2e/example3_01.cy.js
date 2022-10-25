// https://docs.cypress.io/api/introduction/api.html

// import { cy } from 'date-fns/locale';
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
    // http://localhost:7007/iframe.html?id=pages-dashboard--headless
    // http://localhost:7007/?path=/story/pages-dashboard--headless
    cy.contains("h1", "Dashboard - funoFun");
  });

  it("visits the app root and go to about page", () => {
    cy.visit("/");
    cy.log("Server Contex", Cypress.env('SERVER'))
    if (isComonentTest()) {
      cy.visitStorybook('Pages/testboard', 'Full')
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
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Headless')
    } else {
      cy.visit("/");
    }
    // http://localhost:7007/iframe.html?id=pages-dashboard--headless
    // http://localhost:7007/?path=/story/pages-dashboard--headless
    cy.contains("h1", "Dashboard - funoFun");
  });
});



  // cy.visit('localhost:6006/iframe.html?id=component-editperson--filled-form-2&viewMode=story')
