import { ref } from 'vue'
/*
see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
Thema dynamic-tests
  https://stackoverflow.com/questions/63114302/how-to-dynamically-generate-test-cases-in-cypress
  https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__dynamic-tests
  https://glebbahmutov.com/blog/dynamic-api-tests-using-cypress-each/
*/

/**
 * 
 * @param {*} data_test_container 
 * @param {*} widgetIndex 
 * @param {*} prepareTest 
 */
const injectWidget = (data_test_container, widgetIndex, prepareTest) => {
    const to_import = data_test_container.split('/')
    to_import.shift()
    // TODO Vite Alias doesn't work if we move this File into ./support/
    import(`@w/${to_import[0]}/${to_import[1]}.component.template.cy.js`)
        .then(mod => {
            const testName = `Auto Generated Widgets Test ${data_test_container} for widgetIndex ${widgetIndex}`
            console.log('Injecting', testName);

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
            describe(`Import error @w/${to_import[0]}/${to_import[1]}.component.template.cy.js`, () => {
                it('Error', () => {
                    expect(err.message).to.be.equal('')
                })
            })
        })
}

/**
 * 
 * @param {*} widgets 
 * @param {function} prepareTestCallback Callback what is executed before the test runs
 */
const injectWidgets = (source, prepareTest) => {
    const widgets = JSON.parse(Cypress.env('visitTests'))[source]["widgets"]
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
 * @param {*} source Name for Source page/mypage
 * @param {*} prepareTest callback will be executed to prepare the test.
 * @see _pagetest_boilerplate.js
 * @see visit.json
 */
const testWidgets = (source, prepareTest) => {
    testWidgetsArePresent(source)
    injectWidgets(source, prepareTest)
}


export { testWidgets, injectWidgets, testWidgetsArePresent };