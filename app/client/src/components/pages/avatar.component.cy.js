
import { isComonentTest } from '../../../cypress/support/sbHelper.js'

//const path = '../../s.js'

// eval(`require('${path}');`)
//const f = import('../../s.js')
//const g = eval(`require('${path}');`)


import { ref, watchSyncEffect } from 'vue'
const widgetcomponentest = ref([])
var loadDependencyErrors = [];

describe("Visit Avatar", () => {

  before(() => {
    // cy.log("fff", f)
    /* 1 Ermittle was in den childs sein soll */
    cy.log(isComonentTest())
    if (isComonentTest()) {
      cy.visitStorybook('Pages/Avatar', 'HeadlessEditMode')
    } else {
      cy.visit("/");
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
    cy.visitStorybook('Pages/Avatar', 'HeadlessEditMode')
  })

  afterEach(() => {
    cy.log('afterEach')
  })


  after(() => {
    cy.log('After')
  })

  /* Teste das alles da ist was da sein soll */
  it("Teste das alles da ist", () => {
    const widgets = widgetcomponentest.value.filter(item => item.startsWith('widgets/'));
    cy.wrap(widgets)
      .should('have.length.at.least', 1)         // min 1 widgets
      .should('have.length.of.at.most', 2)       // max 2 widgets
      .should('have.length', 1)                  // = 1 widgets
      .should('contain', 'widgets/form/default') // = 1 widgets
  })

  // require(`../../components/widgets/form/default.component.cy.js?e=1dsfsfsdf`)


  for (const componentName of widgetcomponentest.value) {
    if (componentName.startsWith('widgets')) {

      // const target 
      try {
        console.log(`../../components/${componentName}.component.cy.js`)
        require(`../../components/${componentName}.component.cy.js?rnd=65465`) //
      }
      catch (e) {
        console.log('oh no big error')
        console.log(e)
        loadDependencyErrors.push(componentName)
      }
    }
  }

  it('load Dependecys OK', () => {
    //cy.wrap(loadDependencyErrors).should('length', 0)
  })

  /*
    const imported = import(`../../components/${itemName}.component.cy.js`).catch((e) => { })
  */


});
