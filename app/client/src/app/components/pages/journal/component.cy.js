import { PageTest } from '../../../../cypress/support/pageTest.js';

const myPageTest = new PageTest()

describe(myPageTest.getDescription(), () => {

  beforeEach(() => { myPageTest.prepareTest(); })

  myPageTest.testWidgets();

  it("has rendered Journal Dom", () => {
    cy.get('[data-test-container="pages/journal"]')
      .should('be.visible')
  });

});
