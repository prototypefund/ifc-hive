// https://docs.cypress.io/api/introduction/api.html

import { isComonentTest } from './helper.js'

const runCounterTest = () => {
  for (var i = 0; i < 20; i++) {
    cy.contains("p", "click value " + i);
    cy.get('[data-test-id="testboard_count-button"]').click();
  }
}


it.only("Change Settings", () => {
  if (isComonentTest()) {
    cy.visitSB('Pages/Settings', 'HeadlessEditMode')
  } else {
    cy.visit("/");
    cy.get('[data-test-id="sidebar_nav-app-settings"]').click()
    cy.get('[data-test-id="settings_container"]').get('.mdi-view-dashboard-edit-outline').click();
  }
  cy.get('[data-test-id="settings_container"]').contains('Grid Type').click({ force: true });
  // cy.get('[data-test-id="settings_container"]').contains('Grid Type').click({ force: true }).type('{downarrow}{enter}', { force: true })

  cy.get(':nth-child(2) > .v-input > .v-input__control > .v-field > .v-field__append-inner > .mdi-menu-down').click({ force: true });
  cy.get(':nth-child(2) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > .v-select__selection > .v-select__selection-text').click({ force: true });
  cy.get('[data-test-id="settings_container"]').contains('Grid Type').closest('.v-input')
  /*
  cy.get('[data-test-id="loader_container-gridTypes"]').click();
  cy.get('[data-test-id="loader_container-gridTypes"]').contains('Grid Type').click();
  cy.get('[data-test-id="loader_container"]').contains('Grid Type');
  */

})

describe("Test Testborad ", () => {
  it("visit Pages/Testboard and klick value", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'), isComonentTest())
    if (isComonentTest()) {
      for (const name of ['Full', 'Headless']) {
        cy.visitSB('Pages/Testboard', name)
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