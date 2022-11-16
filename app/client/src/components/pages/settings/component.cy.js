
import { isComonentTest } from '../../../../cypress/support/sbHelper.js'
import { testWidgets } from '../../../../cypress/testHelper.js'


const source = 'pages/settings'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook('Pages/Settings', 'HeadlessEditMode')
  } else {
    cy.visit("/");
    cy.get('[data-test-id="sidebar_nav-app-settings"]').click()
    cy.get('[data-test-id="settings_container"]').get('.mdi-view-dashboard-edit-outline').click();
  }
}

describe(`Visit ${source}`, () => {

  /* initialisiere die richtige page */
  beforeEach(() => {
    prepareTest()
  })

  testWidgets(source, prepareTest)

  it("Change Settings", () => {

    cy.get('[data-test-container="pages/settings"]').contains('Grid Type').click({ force: true });
    // cy.get('[data-test-id="settings_container"]').contains('Grid Type').click({ force: true }).type('{downarrow}{enter}', { force: true })

    cy.get(':nth-child(2) > .v-input > .v-input__control > .v-field > .v-field__append-inner > .mdi-menu-down').click({ force: true });
    cy.get(':nth-child(2) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > .v-select__selection > .v-select__selection-text').click({ force: true });
    cy.get('[data-test-container="pages/settings"]').contains('Grid Type').closest('.v-input')
    /*
    cy.get('[data-test-id="loader_container-gridTypes"]').click();
    cy.get('[data-test-id="loader_container-gridTypes"]').contains('Grid Type').click();
    cy.get('[data-test-id="loader_container"]').contains('Grid Type');
    */

  })


});
