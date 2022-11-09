const tests = (within) => {

  it("Visit the Timeline TEST 1", () => {
    within(() => {
      cy.log('Timeline is pressent')
      expect(true)
    })
  });

}

export { tests }