import { PageTest } from '../../../../cypress/support/pageTest.js';

const myPageTest = new PageTest('pages/boilerplate');

describe(myPageTest.getDescription(), () => {

  beforeEach(() => { myPageTest.prepareTest(); })

  myPageTest.testWidgets();

  it("has rendered Boilerplate Dom", () => {
    cy.get('[data-test-container="pages/boilerplate"]')
      .should('be.visible')
  });

});
