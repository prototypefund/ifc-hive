
import { isComonentTest } from '../../../cypress/support/sbHelper.js'
import { testWidgets } from '../../../cypress/testHelper.js'

const source = 'pages/testboard'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook(source, 'Headless')
  } else {
    cy.visit("/");
    cy.get('[data-test-id="sidebar_nav-app-testboard"]').click()
  }

}

const runCounterTest = () => {
  for (var i = 0; i < 3; i++) {
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

describe(`Visit ${source}`, () => {

  /* initialisiere die richtige page */
  beforeEach(() => {
    prepareTest()
  })

  testWidgets(source, prepareTest)

  it("visits the app root and go to about page", () => {

    for (var i = 0; i < 7; i++) {
      cy.get('[data-test-id="testboard_count-button"]').click();
    }
    cy.contains("p", "click value 7");
  })

  it("visit Pages/Testboard and klick value", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'), isComonentTest())
    if (isComonentTest()) {
      for (const name of ['Full', 'Headless']) {
        cy.visitStorybook('Pages/Testboard', name)
        // cy.get('[data-test-id="testboard_container"]')
        runCounterTest();
      }
    } else {
      cy.visit("/"); /// part of integration prep. 
      cy.get('[data-test-id="testboard_count-button"]').click();
      runCounterTest();
    }
  });

});
