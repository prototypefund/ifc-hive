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
describe("Visit Avatar", () => {
  it("Type Email OK", () => {
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitSB('Pages/Avatar', 'HeadlessEditMode')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.get("#name").clear().type("muller");
    cy.get("#vname").clear().type("hans");
    cy.get("#email").clear().type("hansmuller@a1234.com");
    cy.get("[data-testid=widget_avatar-inputErrors]").should('not.exist');
  });

  it("Type Email Bad", () => {
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitSB('Pages/Avatar', 'HeadlessEditMode')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    cy.get("#name").type("123");
    cy.get("#email").clear().type("a1234.com");
    cy.get("[data-test-id=widget_avatar-inputErrors]").should('exist').should('contain', 'email')
  });

  it("Visit Bad Email Preset", () => {
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitSB('Pages/Avatar', 'HeadlessEditModeBadMail')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    // cy.get("#email").clear().type("a1234.com");
    cy.get("[data-test-id=widget_avatar-inputErrors]").should('exist').should('contain', 'email')
  });


});
