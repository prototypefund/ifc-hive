import { isComonentTest } from '../../../../cypress/support/sbHelper.js'
import { injectWidgets } from '../../../../cypress/testHelper.js'


const source = 'pages/dashboard'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook('Pages/Dashboard', 'Headless')
  } else {
    cy.visit("/dashboard");
    // Klick some where...
    // check Route
  }
}

describe(`Visit ${source}`, () => {

  beforeEach(() => {
    prepareTest()
  })

  injectWidgets(source, prepareTest)

  it("visits the app root url dual TEST 1", () => {
    cy.contains("h1", "Dashboard - funoFun");
  });

});
