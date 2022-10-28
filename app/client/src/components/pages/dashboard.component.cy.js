import { isComonentTest } from '../../../cypress/support/sbHelper.js'

describe("Dash Board My First Test ", () => {
  it("visits the app root url dual TEST 1", () => {
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });


  it("visits the app root url dual TEST 2", () => {
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });

});
