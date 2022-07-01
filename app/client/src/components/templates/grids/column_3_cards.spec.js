import { mount } from '@cypress/vue'
import grid from './column_3_cards.vue'

describe('column_3_cards', () => {
    it('Has 3 widgets', () => {
        mount(grid, {
            propsData: {
                contents: [
                    {
                        column: 'v-col-6',
                        widget: false
                    },
                    {
                        column: 'v-col-6',
                        widget: false
                    },
                    {
                        column: 'v-col-6',
                        widget: false
                    }
                ],
            },
        })
        cy.get('[data-test-id="column_3_cardsSlot"]').should('have.length', 1)
    })
})
