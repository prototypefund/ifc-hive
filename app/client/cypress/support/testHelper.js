import visitjson from '../fixtures/visit.json'

/*
  Dynamic Vite Imports
  @see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations

  Thema dynamic-tests
  @see https://stackoverflow.com/questions/63114302/how-to-dynamically-generate-test-cases-in-cypress
  @see https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__dynamic-tests
  @see https://glebbahmutov.com/blog/dynamic-api-tests-using-cypress-each/
*/

var testMap = null
/**
 * @returns What Widgets have to be pressent on what Page
 */
const getTestMap = () => {
    if (testMap == null) {
        testMap = visitjson;
        // testMap = JSON.parse(Cypress.env('visitTests'));
    }
    return testMap;
}

/**
 * 
 * @param {string} data_test_container 
 * @param {number} widgetIndex 
 * @param {function} prepareTest Callback what is executed before each test runs
 */
const injectWidget = (data_test_container, widgetIndex, prepareTest) => {
    const to_import = data_test_container.split('/')
    to_import.shift()
    // TODO Vite Alias doesn't work if we move this File into ./support/
    // import(`@w/${to_import[0]}/${to_import[1]}.component.cy.js`)
    import(`../../src/components/widgets/${to_import[0]}/${to_import[1]}.component.cy.js`)
        .then(mod => {
            const testName = `Will Import Test from ${data_test_container} for widget in SlotIndex ${widgetIndex}`

            describe(testName, () => {
                const within = (callback) => {
                    cy.get(`[data-test-container="${data_test_container}"]`).eq(widgetIndex)
                        .within(callback)
                }
                beforeEach(() => {
                    prepareTest()
                })
                mod.tests(within, widgetIndex)
            })
        })
        .catch(err => {
            describe(`Import error @w/${to_import[0]}/${to_import[1]}.component.cy.js`, () => {
                it('has no test', () => {
                    expect(err.message).to.be.equal('')
                })
            })
        })
}

/**
 * 
 * @param {string} source Name of the Widget
 * @param {function} prepareTest Callback what is executed before the test runs
 */
const injectWidgets = (source, prepareTest) => {
    const testMap = getTestMap()
    if (!(source in testMap)) {
        const msg = `Container id ${source} not found in getTestMap() definition `
        console.log(msg)
        throw new TypeError(msg)
    }
    if (!("widgets" in getTestMap()[source])) {
        const msg = `"widgets" for container id ${source} not found in getTestMap()[\'${source}\'] definition `
        console.log(msg)
        throw new TypeError(msg)
    }

    const widgets = getTestMap()[source]["widgets"]
    for (const widgetpath in widgets) {
        console.log('Injecting Dynamic Widgets Test', JSON.stringify(widgetpath));
        for (var widgetIndex = 0; widgetIndex < widgets[widgetpath]; widgetIndex++) {
            injectWidget(widgetpath, widgetIndex, prepareTest)
        }
    }
}


const testWidgetsArePresent = (source) => {
    it("Teste WidgetsArePresent", () => {
        cy.testWidgetsArePresent(source)
    })
}

/**
 * 
 * @param {string} source Name for Source page/mypage
 * @param {function} prepareTest callback will be executed to prepare the test.
 * @see _pagetest_boilerplate.js
 * @see visit.json
 */
const testWidgets = (source, prepareTest) => {
    testWidgetsArePresent(source)
    injectWidgets(source, prepareTest)
}


export { testWidgets, injectWidgets, testWidgetsArePresent, getTestMap };