// https://docs.cypress.io/api/introduction/api.html

import { isComonentTest } from './helper.js'

const runCounterTest = () => {
  for (var i = 0; i < 20; i++) {
    cy.contains("p", "click value " + i);
    cy.get('[data-test-id="testboard_count-button"]').click();
  }
}


Cypress.Commands.add('asComponentTest', (data) => {
  cy.visit('/')
  cy.log(data)

  for (const name of ['Full', 'Headless']) {
    cy.visitStorybook('Pages/Testboard', name)
    cy.get('[data-test-id="testboard_container"]')
    runCounterTest();
  }
})


it.only("visits the app root and go to about page", () => {
  if (isComonentTest()) {
    cy.visitStorybook('Pages/Testboard', 'Full')
    // Wir müssen immer eine abfrage machen 
    cy.get('[data-test-id]');
  } else {
    cy.visit("/");
    cy.get('[data-test-id="sidebar_nav-app-testboard"]').click()
  }

  for (var i = 0; i < 7; i++) {
    cy.get('[data-test-id="testboard_count-button"]').click();
  }
  cy.contains("p", "click value 7");
})

describe("Test Testborad ", () => {
  it("visit Pages/Testboard and klick value", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'), isComonentTest())
    if (isComonentTest()) {
      for (const name of ['Full', 'Headless']) {
        cy.visitStorybook('Pages/Testboard', name)
        cy.get('[data-test-id="testboard_container"]')
        runCounterTest();
      }
    } else {
      cy.visit("/"); /// part of integration prep. 
      cy.get('[data-test-id="testboard_count-button"]').click();
      runCounterTest();
    }
  });
});
