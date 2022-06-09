import { mount } from '@cypress/vue'
import dashboard from './dashboard.vue'

describe('dashboard', () => {
  it('renders a message from prop data', () => {
    mount(dashboard, {
      propsData: {
        msg: 'Hello Cypress!',
      },
    })

    cy.get('h1').contains('Hello Cypress!')
  })
})
