// https://docs.cypress.io/api/introduction/api.html



const isComonentTest = () => {
  return (Cypress.env('TESTTYPE')=='COMPONENT');
}

const isIntegrationTest = () => {
  return (Cypress.env('TESTTYPE')=='INTEGRATION');
}


const getURL = (title, name) => {

  function rewrite(str) {
    var r_str = str[0].toLowerCase();
    var j = 0;
    var char = ''
    for(var i = 1; i < str.length; i++) {
      char = str[i];
      if (char.toUpperCase() == str[i]) {
        char = char.toLowerCase()
        if(r_str[j]!='-') {
          r_str = r_str + '-'
          j++;
        }
      }
     if (str[i]!='/') {
       r_str = r_str + char
        j++;
     }
   }
   return r_str;
  }




  const r_title = rewrite(title)
  const r_name = rewrite(name)
  return `iframe.html?id=${r_title}--${r_name}`;
}

describe("My First Test", () => {
  it("visits the app root url dual TEST", () => {
    if (isComonentTest()) {
        cy.visit(getURL('Pages/Dashboard', 'Headless'))
        cy.get('[data-test-id]')
    } else {
        cy.visit("/");
    }
    // http://localhost:7007/iframe.html?id=pages-dashboard--headless
    // http://localhost:7007/?path=/story/pages-dashboard--headless
    cy.contains("h1", "Dashboard - funoFun");
  });

  it("visits the app root and go to about page", () => {
    cy.visit("/");
    cy.log("Server Contex", Cypress.env('TESTTYPE'))
    if (isComonentTest()) {
        cy.log('Sadsaf')
        cy.visit(getURL('Pages/Testboard', 'Full'))
        // Wir müssen immer eine abfrage machen 
        cy.get('[data-test-id]')
    } else {
           cy.visit("/");
           cy.get('.v-list > :nth-child(4)').click();   
    }
 
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.get('.mb-10 > .v-btn').click();
    cy.contains("p", "click value 7");
  });
  
  

  it("visits the app root url dual TEST", () => {
    cy.log("Server Contex", Cypress.env('TESTTYPE'))
    if (isComonentTest()) {
        cy.visit(getURL('Pages/Dashboard', 'Headless'))
        cy.get('[data-test-id]')
    } else {
        cy.visit("/");
    }
    cy.contains("h1", "Dashboard - funoFun");
  });

});



  // cy.visit('localhost:6006/iframe.html?id=component-editperson--filled-form-2&viewMode=story')
