
import * as F from './test_sbHelper.stories.js'

describe("Test Testborad ", () => {
  it.only('test test', () => {
    cy.log("title of Test ", F.default.title)

    for (var key in F) {
      if (key != 'default') {
        cy.log("title of Test ", key)
        console.log("s", "" + key)
        cy.visitSB(F.default.title, key)
        cy.get('p').should('contain', 'TEST')
      }
    }

  });
});
