/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { getRelativeURL, isComonentTest } from './sbHelper.js'


/**
 * Vistes a Storybook Page 
 * And waits for the [data-test-id] to Render
 * @param {Title of the Storybook} title 
 * @param {Name or Variable Name} name 
 */
Cypress.Commands.add('visitStorybook', (title, name) => {
    const dstUrl = getRelativeURL(title, name);
    if (isComonentTest()) {
        cy.visit(dstUrl)
        /** Every  */
        return cy.get('[data-test-id],[data-test-container]')
    } else {
        // Normaly Not used
        // https://github.com/cypress-io/cypress/issues/8382
        return cy.origin('http://localhost:6006', { args: { dstUrl } }, ({ dstUrl }) => {
            cy.visit('http://localhost:6006/' + dstUrl)
        })
    }
})
