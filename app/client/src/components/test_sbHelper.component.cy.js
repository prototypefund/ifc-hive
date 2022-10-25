
import * as TestSB from './test_sbHelper.stories.js'
import { listStoriesFromClass } from '../../cypress/support/sbHelper.js'


describe("Test Testborad ", () => {
  // isComonentTest() &&
  it.only('Viste Tests test', () => {
    const stories = listStoriesFromClass(TestSB)
    cy.log("Title of Test", TestSB.default.title)
    cy.log(JSON.stringify(stories))

    /**
     * Iterate thrue Tests from Import
     */
    for (var storie of stories) {
      cy.log(storie.title, storie.name)
      cy.visitStorybook(storie.title, storie.name)
      cy.get('p').should('contain', 'TEST')
    }
  });
});
