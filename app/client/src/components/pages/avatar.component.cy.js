
import { isComonentTest } from '../../../cypress/support/sbHelper.js'
import { testWidgets } from '../../../cypress/testHelper.js'


const source = 'pages/avatar'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook(source, 'Headless')
  } else {
    // Klick some where...
    // check Route
    cy.visit(source.split('/')[1]);
    /* or visit via sidbar */
    // cy.visit("/");
    // cy.get('[data-test-id="sidebar_nav-app-journal"]').click()
  }
}

describe(`Visit ${source}`, () => {

  /* initialisiere die richtige page */
  beforeEach(() => {
    cy.log('Before')
    prepareTest()
  })

  /* Teste das alles da ist was da sein soll */

  testWidgets(source, prepareTest)

  it('some test', () => {

  })

});


