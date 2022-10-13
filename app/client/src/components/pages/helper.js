

const isComonentTest = () => {
    return (Cypress.env('TESTTYPE')=='COMPONENT');
  }
  
  const isIntegrationTest = () => {
    return (Cypress.env('TESTTYPE')=='INTEGRATION');
  }
  

export { isComonentTest, isIntegrationTest };