

const runTest = (name, isComonentTest = true) => {
  if (isComonentTest) {
    var rq = require(`../../src/components/pages/${name}/component.cy.js?isComonentTest0=A`)
  } else {
    var rq = require(`../../src/components/pages/${name}/component.cy.js?isComonentTest0=B`)
  }
}



