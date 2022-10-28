import { isComonentTest } from '../../../../cypress/support/sbHelper.js'

it("Type Email OK", () => {
  cy.getInput('firstname').clear().type("Moo");
  cy.getInput('name').type("Koo");
  cy.getInput('email').type("email@milch.lol");
  cy.get("[data-test-id=widget_avatar-inputErrors]").should('not.exist')
});


it("Type Email OK 2", () => {
  cy.get('[data-test-container="widgets/form/default"]')
    .within(() => {
      cy.getInput('firstname').clear().type("Moo");
      cy.getInput('name').type("Koo");
      cy.getInput('email').type("email@milch.lol");
      cy.get("[data-test-id=widget_avatar-inputErrors]")
        .should('not.exist')
    })
});

it("Type Bad Email", () => {
  cy.get('[data-test-container="widgets/form/default"]')
    .within(() => {
      cy.getInput('firstname').clear().type("Moo");
      cy.getInput('name').clear().type("Koo");
      cy.getInput('email').type("email@milch.lol").clear().type('Vergessen');

      // cy.get('[data-test-container="widgets/form/default"]')
      cy.find('widget_avatar-inputErrors')
        .should('exist')
        .should('contain', 'email')
      //.should('exist').should('contain', 'email')
      // cy.get("[data-test-id=widget_avatar-inputErrors]").should('exist').should('contain', 'email')
    })
});


it("Type Name and Email", () => {
  cy.getInput('firstname').clear().type("Mooooooooooooooooooooooooooooooooooooooo")
  cy.getInput('name').type("Koo");
  cy.getInput('email').clear().type("emah")

  cy.get('[data-test-container="widgets/form/default"]')
    .find('widget_avatar-inputErrors')
    .should('exist')
    .should('contain', 'email')

  //.should('exist').should('contain', 'email')
  // cy.get("[data-test-id=widget_avatar-inputErrors]").should('exist').should('contain', 'email')
});
/*
const gridItemLoader = function (itemName = 'card') {
  return import(`../components/templates/grids/items/${itemName}.vue`).catch(e => {
    return import(`../components/templates/grids/error.vue`)
  })
}*/

/*
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
*/
