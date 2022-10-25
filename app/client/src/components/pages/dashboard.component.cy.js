/*
 * Naming 
 * <dashboard.vue> -> data-test-id="dashboard_container"
 */

import { isComonentTest } from './helper.js'


/*
 * http://localhost:7007/iframe.html?id=pages-dashboard--headless
 * http://localhost:7007/?path=/story/pages-dashboard--headless
 */
// const isComonentTest = () => { return false }
describe("Dash Board My First Test ", () => {
  it("visits the app root url dual TEST 1", () => {
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });


  it("visits the app root url dual TEST 2", () => {
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Dashboard', 'Headless')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });

});
