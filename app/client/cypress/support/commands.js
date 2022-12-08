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
import { getTestMap } from './testHelper.js'

/**
 * Vistes a Storybook Page 
 * And waits for the [data-test-id] to Render
 * @param {string} title Title of the Storybook
 * @param {string} name Name or Variable Name
 */
Cypress.Commands.add('visitStorybook', (title, name) => {
    const dstUrl = getRelativeURL(title, name);
    if (isComonentTest()) {
        cy.visit(dstUrl)
        /** Every  */
        return cy.get('[data-test-id],[data-test-container],[data-test-container-uuid]')
    } else {
        // Normaly Not used
        // https://github.com/cypress-io/cypress/issues/8382
        return cy.origin('http://localhost:6006', { args: { dstUrl } }, ({ dstUrl }) => {
            cy.visit('http://localhost:6006/' + dstUrl)
        })
    }
})

Cypress.Commands.add('getInput', (testid) => {
    return cy.get(`[data-test-id="${testid}"]`).find('input')
})

Cypress.Commands.add('getInputError', (testid) => {
    return cy.get(`[data-test-id="${testid}"] > .v-input__details > .v-messages > .v-messages__message`)
})


/**
 * Filles the Child Containers and there UUIDS into an array.
 */
Cypress.Commands.add('getContainer', (widgetcomponentest) => {
    // Teste das die Anzal der Wigets stimmt
    // Teste das die Widgets einzeln Exsitiern
    cy.get('[data-test-container]')
        .each(
            x => {
                cy.wrap(x)
                    .invoke('attr', 'data-test-container')
                    .then(container => {
                        cy.wrap(x)
                            .invoke('attr', 'data-test-container-uuid')
                            .then(uuid => {
                                widgetcomponentest.value.push({ name: container, uuid })
                            })
                    })
            }
        )
});

/**
 * cy.getWidgetsFromID(source).then((x) => { 
 *    x = { "widgets/name/default": [uuid,uuid], ... }
 * })
 */
Cypress.Commands.add('getWidgetsFromID', (taget) => {
    // Teste das die Anzal der Wigets stimmt
    // Teste das die Widgets einzeln Exsitiern
    const result = {}
    return cy.get('[data-test-container]').should('have.length.lt', 1000).then(
        (_) => {
            return cy.get(`[data-test-container="${taget}"]`).find('[data-test-container]').each(
                (x) => {
                    cy.log('FOUND', x)
                    cy.wrap(x)
                        .invoke('attr', 'data-test-container')
                        .then(container => {
                            cy.wrap(x).should('contain.attr', 'data-test-container-uuid').then(
                                uuid => {
                                    if (!result[container]) {
                                        result[container] = []
                                    }
                                    result[container].push(uuid)
                                }
                            )
                        })
                }
            ).then(
                () => {
                    return result;
                }
            )

        }
    )


    /*
        inconsisten. 
        return cy.get(`[data-test-container="${taget}"]`)
        .within(() => {
            // force Cypress to wait for 1000 Comonents.
            // Doesn't remove this line or not all ID's are yeald all children.
            cy.get('[data-test-container]').should('have.length.lt', 1000)
            cy.get('[data-test-container]')
                .each(
                    (x) => {
                        cy.log('FOUND', x)
                        cy.wrap(x)
                            .invoke('attr', 'data-test-container')
                            .then(container => {
                                cy.wrap(x).should('contain.attr', 'data-test-container-uuid').then(
                                    uuid => {
                                        if (!result[container]) {
                                            result[container] = []
                                        }
                                        result[container].push(uuid)
                                    }
                                )
                                // cy.wrap(x).invoke('attr', 'data-test-container-uuid').then(uuid => { })
                            })
                    }
                )
        }).then(
            () => {
                return result;
            }
        )

        */
});


/**
 * Check if all Predefined wigets are pressent in the app
 * 
 * source Page Definition page/MyPage
 * 
 * bidirectional if true Test will check all wigets in the app are in the defintion and Vice Versa
 */
Cypress.Commands.add('testWidgetsArePresent', (source, bidirectional = true) => {

    cy.getWidgetsFromID(source).then((x) => {
        const widgetcomponentest = x
        const testMap = getTestMap()
        if (!(source in testMap)) {
            const msg = `id ${source} not found in getTestMap() definition`
            cy.log(msg)
            console.log(msg)
            throw new TypeError(msg)
        }
        const testdata = testMap[source]
        for (const widgetPath in testdata['widgets']) {
            const expected_length = testdata['widgets'][widgetPath]
            cy.log(`Probe widget '${widgetPath}' in Definition is on Page`)
            cy.wrap(widgetcomponentest)
                .should("contain.key", widgetPath)
                .then(x => {
                    cy.log('Probe widget count', expected_length)
                    cy.wrap(x[widgetPath])
                        .should('have.length', expected_length)
                })
        }
        if (bidirectional) {
            for (const widgetPath in widgetcomponentest) {
                const expected_length = widgetcomponentest[widgetPath].length
                cy.log(`Found widget '${widgetPath}' on Page check is in defintion Definition`)
                cy.wrap(testdata['widgets'])
                    .should("contain.key", widgetPath)
                    .then(x => {
                        cy.log('Probe widget count', expected_length)
                        cy.wrap(x[widgetPath])
                            .should('equal', expected_length)
                    })
            }
        }


    })
})


Cypress.Commands.add('testWidgetsArePresent', (source, bidirectional = true) => {
    const env = getTestMap()
    if (!(source in env)) {
        const msg = `id ${source} not found in getTestMap() definition`
        cy.log(msg)
        console.log(msg)
        throw new TypeError(msg)
    }
    const testdata = env[source]
    cy.get(`[data-test-container="${source}"]`)
        .within(() => {
            for (const widgetPath in testdata['widgets']) {
                const expected_length = testdata['widgets'][widgetPath]
                cy.log(`Probe widget '${widgetPath}' in Definition is on Page`)
                cy.get(`[data-test-container="${widgetPath}"]`)
                    .should('have.length', expected_length)
            }

        })

})