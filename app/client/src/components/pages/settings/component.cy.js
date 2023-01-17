import { PageTest } from '../../../../cypress/support/pageTest.js';

const myPageTest = new PageTest()

describe(myPageTest.getDescription(), () => {

  beforeEach(() => { myPageTest.prepareTest(); })

  myPageTest.testWidgets();

  it("has rendered Settings Dom", () => {
    cy.get('[data-test-container="pages/settings"]')
      .should('be.visible')
  });

});