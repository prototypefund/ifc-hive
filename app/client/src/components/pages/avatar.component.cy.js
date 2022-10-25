
import { isComonentTest } from './helper.js'

/*
 * http://localhost:7007/iframe.html?id=pages-dashboard--headless
 * http://localhost:7007/?path=/story/pages-dashboard--headless
 */
/*
 * Naming 
 * <dashboard . vue> -> data-test-id="dashboard_container"
 */

Cypress.Commands.add('getInput', (testid) => {
  return cy.get(`[data-test-id="${testid}"]`, {log:false}).find('input', {log:false})
})

describe("Visit Avatar", () => {
  it("Type Email OK", () => {
  /** 
   * Poiler Plate code
   */
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Avatar', 'HeadlessEditMode')
    } else {
      cy.visit("/");
    }
    // data-test-container="pages/avatar"
    // data-test-container="widgets/form/default"
    cy.get('[data-test-container="pages/avatar"]')
     .within(() => {
      cy.getInput('firstname').clear().type("Moo");    
      cy.getInput('name').type("Koo");
      cy.getInput('email').type("email@milch.lol");
    })
    cy.get("[data-test-id=widget_avatar-inputErrors]").should('not.exist')
  });

  it("Type Email Bad", () => {
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Avatar', 'HeadlessEditMode')
    } else {
      cy.visit("/");
    }

    cy.get('[data-test-container="pages/avatar"]')
      .within(() => {
        cy.getInput('firstname').clear().type("Moo");    
        cy.getInput('name').clear().type("Koo");
        cy.getInput('email').type("email@milch.lol").clear().type('Vergessen');

        cy.getInput('firstname').clear().type("Moo");    
        cy.getInput('name').type("Koo");
        cy.getInput('email').clear().type("emah");
        cy.get('[data-test-container="widgets/form/default"]')
        .find('widget_avatar-inputErrors').should('exist').should('contain', 'email')
     //.should('exist').should('contain', 'email')
     // cy.get("[data-test-id=widget_avatar-inputErrors]").should('exist').should('contain', 'email')
   })


   
  });

  it("Visit Bad Email Preset", () => {
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Avatar', 'HeadlessEditModeBadMail')
      cy.get('[data-test-id]')
    } else {
      cy.visit("/");
    }
    // cy.get("#email").clear().type("a1234.com");
    cy.get("[data-test-id=widget_avatar-inputErrors]").should('exist').should('contain', 'email')
  });


});
