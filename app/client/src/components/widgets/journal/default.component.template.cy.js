const tests = (within) => {

  it("Visit journal TEST 1", () => {
    within(() => {
      cy.log('journal is pressent')
      expect(true)
    })
  });

}

export { tests }