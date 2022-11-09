/**
 * NORMAL
 * @param {*} within callback 
 */
const tests = (within) => {
  it("Type Email OK", () => {
    within(() => {
      cy.log('Run inside THE Widget')
      expect(true)
    })
  });
}

/**
 * 
 * @param {*} within callback
 * @param {*} widgetIndex index of This Widget
 */
const tests_alternativ = (within, widgetIndex) => {
  it("Type Email OK", () => {
    const data_test_container = 'widgets/NAME/default'
    cy.log('Run OUTSIDE THE Widget')

    cy.get(`[data-test-container="${data_test_container}"]`).eq(widgetIndex)
      .within(() => {
        cy.log('Run inside THE Widget')
        expect(true)
      })
  });
}


export { tests }