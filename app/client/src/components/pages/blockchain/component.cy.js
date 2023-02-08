
import { PageTest } from '../../../../cypress/support/pageTest.js';

const myPageTest = new PageTest()

/**
 * All 3 Are the same.
 * const myPageTest1 = new PageTest('pages/boilerplate', 'Headless', 'boilerplate')
 * const myPageTest2 = new PageTest('pages/boilerplate', 'Headless')
 * Uses 'pages/boilerplate' to get Route '/boilerplate'
 * 
 * const myPageTest2 = new PageTest('pages/boilerplate')
 * Uses 'Headless' as Default for Strorybook Name 
 * 
 * const myPageTest1 = new PageTest() 
 * Detects Page By Filename of this test
 * 
 */

describe(myPageTest.getDescription(), () => {

  beforeEach(() => { myPageTest.prepareTest(); })
  myPageTest.testWidgets();

  it("has rendered Boilerplate Dom", () => {
    cy.get('[data-test-container="pages/boilerplate"]')
      .should('be.visible')
  });

  it("Boilerplate has Text ", () => {
    cy.get('[data-test-container="pages/boilerplate"]')
      .should('contain.text', 'This is a Page Boilerplate')
  });

});
