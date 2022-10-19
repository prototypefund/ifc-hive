

const isComonentTest = () => {
  return (Cypress.env('TESTTYPE') == 'COMPONENT');
}

/*
const isIntegrationTest = () => {
  return (Cypress.env('TESTTYPE') == 'INTEGRATION');
}*/

/*
'Pages/Testbo/sdfard', 'UxlllUUl2' -> 'pages-testbo-sdfard--uxlll-u-ul-2'
'Pages/Testbo/sdfard', 'UxlllUUU2' -> 'pages-testbo-sdfard--uxlll-u-u-u-2' BUT SHOULD BE 'pages-testbo-sdfard--uxlll-uuu-2'
*/


/**
 * @TODO Doesn't cover all cases need fix or derive the id
 * @param {Title of the Storybook} title 
 * @param {Name or Variable Name} name 
 */
const getQuerryId = (title, name) => {
  /*
    Axiom xlU -> xl-U
    Axiom xUl -> x-Ul
  */

  function rewrite(str) {
    var r_str = str[0].toLowerCase();
    var j = 0;
    var char = ''
    for (var i = 1; i < str.length; i++) {
      char = str[i];
      if (char.toUpperCase() == str[i]) {
        char = char.toLowerCase()
        if (r_str[j] != '-') {
          r_str = r_str + '-'
          j++;
        }
      }
      if (str[i] != '/') {
        r_str = r_str + char
        j++;
      }
    }
    return r_str;
  }
  function rewrite(str) {
    var result = str.replace(/([A-Z]+)/g, " $1");
    result = result.replace(/([A-Z][a-z])/g, " $1");
    result = result.replace(/(_)/g, " ");
    result = result.replace(/(\/)/g, " ");
    result = result.replace(/([0-9]+)/g, " $1").trim();
    result = result.replace(/\s+/g, "-");
    return result.toLowerCase();
  }

  const r_title = rewrite(title)
  const r_name = rewrite(name)
  return `${r_title}--${r_name}`;
}

/**
 * @param {Title of the Storybook} title 
 * @param {Name or Variable Name} name 
 * @returns Relative URL for Storybook
 */
const getRelativeURL = (title, name) => {
  const qid = getQuerryId(title, name)
  return `iframe.html?id=${qid}&viewMode=story`;
}

export { isComonentTest, getRelativeURL };