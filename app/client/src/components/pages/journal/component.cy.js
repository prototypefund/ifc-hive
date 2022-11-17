
import { isComonentTest } from '../../../../cypress/support/sbHelper.js'
import { testWidgets } from '../../../../cypress/support/testHelper.js'


const source = 'pages/journal'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook(source, 'Headless')
  } else {
    cy.visit("/");
  }
}

describe(`Visit ${source}`, () => {

  /* initialisiere die richtige page */
  beforeEach(() => {
    prepareTest()
  })
  it("has rendered Journal Dom", () => {
    cy.get('[data-test-container="pages/journal"]')
      .should('be.visible')
  });
  testWidgets(source, prepareTest)

});
