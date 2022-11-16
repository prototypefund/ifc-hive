/**
 * Nice To Know and how to avoid name Collisions.
 * Every Storybook can be accsessd over the normal Webiterface.
 * The Storry book server renders each strorrie insde an ifram 
 * under http://.../iframe.html?id={storryID}.
 * The storryID is dirved, by substitution of chacatters,
 * from the title and the Variable name exporded by the storry.
 * 
 * Where can i find the Existing stories ?
 * Use the via the server http://.../stories.json
 * Inside the storybook-static/stories.json
 * The fastest way is the listStoriesFromClass function.
 * 
 * Name and id Collisions Example:
 * export const HeadlessEditModeBadMail  = ...
 * export const Headless_EditModeBadMail = ...
 * Both exports now have the SAME name and same ID Suffix.
 * id:   <tileprefix>--headless-edit-mode-bad-mail
 * name:	"Headless Edit Mode Bad Mail"
 * 
 * How does storybook deal with Name Collisions ?
 * This verion @storybook/vue3": "^6.5.12" 
 * The second exported storry will now shadow the first,
 * because both are mapped to the same name.
 * It EVEN disaperes in the Webiterface,
 * therefore they are NOT reachable by any test
 * 
 * How to detect Name Collisions ?
 * the listStoriesFromClass will return multiple Objects with the same id but diffrent varname's
 *  { title: "title", varname: "AbC", name: "Ab C", id: "title--ab-c" },
 *  { title: "title", varname: "Ab_C", name: "Ab C", id: "title--ab-c" }
 * 
 */

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

/**
 * Dynamic Vite Imports
 * 
 * https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
 */

export { isComonentTest, getRelativeURL, getNameFrom, getQuerryId, listStoriesFromClass };