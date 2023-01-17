import { PageTest } from '../../../../cypress/support/pageTest.js'

const myPageTest = new PageTest()

describe(myPageTest.getDescription(), () => {

  beforeEach(() => { myPageTest.prepareTest(); })

  it("has rendered testboard Dom", () => {
    cy.get('[data-test-container="pages/testboard"]')
      .should('be.visible')
  });

  myPageTest.testWidgets();

});
