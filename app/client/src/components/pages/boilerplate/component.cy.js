
import { isComonentTest } from '../../../../cypress/support/sbHelper.js'
import { testWidgets } from '../../../../cypress/testHelper.js'


const source = 'pages/boilerplate'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook(source, 'Headless')
  } else {
    // visit via route
    cy.visit(source.split('/')[1]);
    /* or visit via sidbar */
    // cy.visit("/");
    // cy.get('[data-test-id="sidebar_nav-app-journal"]').click()
  }
}

describe(`Visit ${source}`, () => {

  /* initialisiere die richtige page */
  beforeEach(() => {
    prepareTest()
  })

  testWidgets(source, prepareTest)

  it('some test', () => {
  })

});
