
import * as F from './test_test.stories.js'

describe("Test Testborad ", () => {
  it.only('test test', () => {
    cy.log("title of Test ", F.default.title)

    for (var k in F) {
      console.log(k)
    }

    cy.get('')
  });
});
