import { isComonentTest } from '../../../../cypress/support/sbHelper.js'


it("Type Email OK", () => {
  cy.getInput('firstname').clear().type("Moo");
  cy.getInput('name').clear().type("Koo");
  cy.getInput('email').clear().type("email@milch.lol");
  cy.getInputError('firstname').should('not.exist')
  cy.getInputError('name').should('not.exist')
  cy.getInputError('email').should('not.exist')
});

it("Type Email OK 2", () => {
  cy.get('[data-test-container="widgets/form/default"]')
    .within(() => {
      cy.getInput('firstname').clear().type("Moo");
      cy.getInput('name').clear().type("Koo");
      cy.getInput('email').clear().type("Moo.Koo@some-mail.com");
      cy.getInputError('firstname').should('not.exist')
      cy.getInputError('name').should('not.exist')
      cy.getInputError('email').should('not.exist')
    })
});


it("Type Bad Email", () => {
  cy.get('[data-test-container="widgets/form/default"]')
    .within(() => {
      cy.getInput('firstname').clear().type("Herman");
      cy.getInput('name').clear().type("Koo");
      cy.getInput('email').type("email@milch.lol").clear().type('Vergessen');
      cy.getInputError('firstname').should('not.exist')
      cy.getInputError('name').should('not.exist')
      // Check there was an error!
      cy.getInputError('email').should('exist')
      // With localized Message
      cy.getInputError('email').should('contain', 'E-mail')

    })
});


it("Type Bad Email and Too Long Name", () => {
  cy.get('[data-test-container="widgets/form/default"]')
    .within(() => {
      cy.getInput('email').clear().type("emah")
      cy.getInputError('email').should('exist')
      cy.getInput('firstname').clear().type("Mooooooooooooooooooooooooooooooooooooooo")
      // Expect the name to be too Long      
      cy.getInput('firstname').clear().type("abcdefghij")
      // Expect the name to be too Long
      cy.getInputError('firstname').should('not.exist')
      cy.getInput('name').type("Koo1234568");
      cy.getInputError('name').should('exist')
    })
});


it("Type Name Corner Case", () => {
  cy.get('[data-test-container="widgets/form/default"]')
    .within(() => {
      cy.getInput('firstname').clear().type("abcdefghij")
      // Expect the name to be too Long
      cy.getInputError('firstname').should('not.exist')
    })
});


