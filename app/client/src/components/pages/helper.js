

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
    return `iframe.html?id=${r_title}--${r_name}&viewMode=story`;
  }


export { isComonentTest, isIntegrationTest, getURL };