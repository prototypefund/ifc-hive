
import { isComonentTest } from '../../../../cypress/support/sbHelper.js'


// TODO How to drive this data ? 
const sidebar_route = { dashboard: '/dashboard', settings: '/settings', testboard: '/testboard', journal: '/journal' }

describe("Navigate True Sidebar", () => {
  it("visits Sidebar", () => {
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Full')
      cy.get('[data-test-id]');
    } else {
      cy.visit("/");
      let count = 0;
      cy.get('[data-test-container="utils/navigation/sidebar"]')
        .within(
          () => {
            for (const buttonSuffix in sidebar_route) {
              cy.get(`[data-test-id="sidebar_nav-app-${buttonSuffix}"]`).click({ force: true })
              cy.location('pathname').should('eq', sidebar_route[buttonSuffix])
            }
          }
        ).then(() => {
          cy.get(`[data-test-id]`).each(
            (x) => {
              cy.wrap(x).invoke('attr', 'data-test-id').then(
                (id) => {
                  if (id.startsWith('sidebar_nav-app')) {
                    count = count + 1;
                  }
                }
              )
            }
          )
        }).then(() => {
          expect(count).eq(Object.keys(sidebar_route).length)
        })
    }
  });
});