import { mount } from '@cypress/vue'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorl', () => {
  it('renders a message from prop data', () => {
    mount(HelloWorld, {
      propsData: {
        msg: 'Hello Cypress!',
      },
    })

    cy.get('h1').contains('Hello Cypress!')
  })
})
