
import { isComonentTest, importWigetTests } from '../../../cypress/support/sbHelper.js'


import { ref, watchSyncEffect } from 'vue'
const widgetcomponentest = ref([])
Cypress.Commands.add('getContainer', (widgetcomponentest) => {
  // Teste das die Anzal der Wigets stimmt
  // Teste das die Widgets einzeln Exsitiern
  cy.get('[data-test-container]')
    .each(
      x => {
        cy.wrap(x)
          .invoke('attr', 'data-test-container')
          .then(attribs => {
            widgetcomponentest.value.push(`${attribs}`)
          })
      }
    )
})

describe("Visit Avatar", () => {

  before(() => {
    // cy.log("fff", f)
    /* 1 Ermittle was in den childs sein soll */
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Avatar', 'HeadlessEditMode')
    } else {
      cy.visit("/avatar");
      // Klick some where...
      // check Route
    }
    cy.get('[data-test-container="pages/avatar"]')
      .within(() => {
        cy.getContainer(widgetcomponentest)
      })
  })

  /* initialisiere die richtige page */
  beforeEach(() => {
    cy.log('Before')
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Avatar', 'HeadlessEditMode')
    } else {
      cy.visit("/avatar");
    }
  })




  /* Teste das alles da ist was da sein soll */
  it("Teste das alles da ist", () => {
    const widgets = widgetcomponentest.value.filter(item => item.startsWith('widgets/'));
    cy.wrap(widgets)
      .should('have.length.at.least', 1)         // min 1 widgets
      .should('have.length.of.at.most', 2)       // max 2 widgets
      //.should('have.length', 1)                  // = 1 widgets
      .should('contain', 'widgets/form/default') // = 1 widgets
  })




  const loadDependencyErrors = importWigetTests('avatar')
  it('load Dependecys OK', () => {
    cy.wrap(loadDependencyErrors).should('length', 0)
  })


  /*
    const imported = import(`../../components/${itemName}.component.cy.js`).catch((e) => { })
  */
});

