
const tests = (within) => {
  it("Widget User", () => {
    within(() => {
      cy.log('Run inside THE Widget')
      expect(true)
    })
  });
}

export { tests }