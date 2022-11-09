
import { isComonentTest } from '../../../cypress/support/sbHelper.js'
import { testWidgets } from '../../../cypress/testHelper.js'


const source = 'pages/journal'

const prepareTest = () => {
  if (isComonentTest()) {
    cy.visitStorybook(source, 'Headless')
  } else {
    cy.visit("/");
    cy.get('[data-test-id="sidebar_nav-app-journal"]').click()
  }
}

describe(`Visit ${source}`, () => {

  /* initialisiere die richtige page */
  beforeEach(() => {
    prepareTest()
  })

  testWidgets(source, prepareTest)


  it("visit Pages/Testboard and klick value", () => {

    cy.get('[data-test-container="pages/journal"]')


    cy.get('.v-timeline-item__body')
      .filter(':contains("Mustermann")')
      .should('contain', 'Meilenstein')

    cy.get('.v-timeline-item__body')
      .filter(':contains("Mustermann")')
      .each(element => {
        cy.wrap(element).should('contain', 'Planung')
      });


  });
});
