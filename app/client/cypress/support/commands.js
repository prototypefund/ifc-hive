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

// https://github.com/cypress-io/cypress/issues/8382
Cypress.Commands.add('visitSB', (title, name) => {
    const dstUrl = getRelativeURL(title, name);
    if (isComonentTest()) {
        return cy.visit(dstUrl)
    } else {

        return cy.origin('http://localhost:6006', { args: { dstUrl } }, ({ dstUrl }) => {
            cy.visit('http://localhost:6006/' + dstUrl)
        })
    }
})
