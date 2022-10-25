
/**
 * Returns If the we are in an Component Test (Storrybook) Envirnent
 * @returns {true} if we are inside Storrybook
 */
const isComonentTest = () => {
  return (Cypress.env('TESTTYPE') == 'COMPONENT');
}

/**
 * Lists the exported Stories from a Given stories.js
 * @example
 * import * as MySB from './test_sbHelper.stories.js'
 * 
 * listStoriesFromClass(MySB)
 * 
 * @param {*} clazz StoryBookClass
 * @returns List of Stories [{title, varname, name, id }]
 */
const listStoriesFromClass = (clazz) => {
  var result = []
  const title = `${clazz.default.title}`
  for (var varname in clazz) {
    if (varname != 'default') {
      result.push({ title, varname, name: getNameFrom(varname), id: getQuerryId(title, varname) })
    }
  }
  return result;
}


const getTitleFrom = (nameOrVarname) => {
  var result = nameOrVarname.replace(/([A-Z]+)/g, " $1");
  result = result.replace(/([A-Z][a-z])/g, " $1");
  result = result.replace(/(_)/g, " ");
  result = result.replace(/(\/)/g, " ");
  result = result.replace(/([0-9]+)/g, " $1").trim();
  result = result.replace(/\s+/g, " ");
  return result;
}

/**
 * Convertes the Storie Variable name into the Story Name
 * @example
 * getNameFrom('TestCaseXYZ') => 'Test Case XYZ'
 * @param {string} nameOrVarname 
 * @returns 
 */
const getNameFrom = (nameOrVarname) => {
  var result = nameOrVarname
  result = result.replace(/([A-Z]+)/g, " $1");
  result = result[0].toUpperCase() + result.substring(1)
  // result = result.replace(/([A-Z][a-z])/g, " $1");
  result = result.replace(/([A-Z][a-z])/g, " $1");
  result = result.replace(/(_)/g, " ");
  result = result.replace(/(\/)/g, " ");
  result = result.replace(/(\$)/g, " ");
  result = result.replace(/([0-9]+)/g, " $1 ");
  result = result.replace(/\ [a-z]/g, (str) => { return str.toUpperCase(); })

  result = result.replace(/\s+/g, " ").trim();
  return result;
}

/**
 * @TODO Doesn't cover all cases need fix or derive the id
 * @param {string} title Title of the Storybook 
 * @param {string} name Name or Variable Name 
 */
const getQuerryId = (title, name) => {

  function rewrite(str) {
    var result = getNameFrom(str);
    result = result.replace(/\s+/g, "-")
    return result.toLowerCase();
  }

  const r_title = rewrite(title)
  const r_name = rewrite(name)
  return `${r_title}--${r_name}`;
}

/**
 * @param {string} title Title of the Storybook 
 * @param {string} name Name or Variable Name 
 * @returns Relative URL for Storybook
 */
const getRelativeURL = (title, name) => {
  const qid = getQuerryId(title, name)
  return `iframe.html?id=${qid}&viewMode=story`;
}

export { isComonentTest, getRelativeURL, getNameFrom, getQuerryId, listStoriesFromClass };