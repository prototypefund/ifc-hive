
import { isComonentTest } from '../../../../cypress/support/sbHelper.js'
import { testWidgets } from '../../../../cypress/support/testHelper.js'


const source = 'pages/testboard'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook(source, 'Headless')
  } else {
    cy.visit(source.split("/")[1]);
  }
}

describe(`Visit ${source}`, () => {

  /* initialisiere die richtige page */
  beforeEach(() => {
    prepareTest()
  })
  it("has rendered testboard Dom", () => {
    cy.get('[data-test-container="pages/testboard"]')
      .should('be.visible')
  });

  testWidgets(source, prepareTest)

});
