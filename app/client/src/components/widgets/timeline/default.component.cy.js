const tests = (within) => {

  it("Widget Timeline has Test", () => {
    within(() => {
      cy.log('Timeline has Test')
      expect(true)
    })
  });

}

export { tests }