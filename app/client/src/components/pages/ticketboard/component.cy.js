import { isComonentTest } from '../../../../cypress/support/sbHelper.js'
import { testWidgets } from '../../../../cypress/support/testHelper.js'

const source = 'pages/boilerplate'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook(source, 'Headless')
  } else {
    cy.visit("/");
  }
}

describe(`Visit ${source}`, () => {

  beforeEach(() => {
    prepareTest()
  })

  it("has rendered Boilerplate Dom", () => {
    cy.get('[data-test-container="pages/boilerplate"]')
      .should('be.visible')
  });
  testWidgets(source, prepareTest)

});
