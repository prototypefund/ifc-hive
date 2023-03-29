const tests = (within) => {

  it("Visit debug TEST 1", () => {
    within(() => {
      cy.log('debug is pressent')
      expect(true)
    })
  });

}

export { tests }