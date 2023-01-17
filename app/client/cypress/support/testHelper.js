cy = cy
import visitjson from '../fixtures/visit.json'
import { getSlotWidgetsWrapped, getSlotWidgets } from './storeHelper.js'

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
        //throw new TypeError(msg)
        return;
    }
    if (!("widgets" in getTestMap()[source])) {
        const msg = `"widgets" for container id ${source} not found in getTestMap()[\'${source}\'] definition `
        console.log(msg)
        //throw new TypeError(msg)
        return;
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

    it('Test Store is Pressent Without Window', () => {
        expect(Cypress.__store, 'Cypress.__store != undefined').to.not.be.undefined
    })

    it('Test Store is Pressent with Window', () => {
        cy.window().then((win) => {
            expect(win.__store, 'win.__store != undefined').to.not.be.undefined
            expect(win.__store, 'win.__store != false').to.not.be.false
            expect(win.__widgets, 'win.__widgets != undefined').to.not.be.undefined
            expect(win.__currentPage, 'win.__currentPage != undefined').to.not.be.undefined
        })
    })


    it('Test #data-test-container = #slots + 1', () => {
        cy.get('[data-test-container]').should('have.length', getSlotWidgets().length + 1)
        getSlotWidgetsWrapped().then(
            (slots) => {
                cy.get('[data-test-container]').should('have.length', slots.length + 1)
            }
        )
    })

    it.only('Test Every Widget data-test-container="widget/*" has a data-test-container-uuid', () => {
        var found_widgets = 0;
        cy.get('[data-test-container]').should('have.length', getSlotWidgets().length + 1).each(
            (container) => {
                cy.wrap(container)
                    .invoke('attr', 'data-test-container')
                    .then(container_value => {
                        if (container_value.startsWith('widgets/')) {
                            cy.wrap(container)
                                .invoke('attr', 'data-test-container-uuid').then(
                                    (container_uuid) => {
                                        cy.log(`Found ${found_widgets} data-test-container=${container_value} data-test-container-uuid=${container_uuid}`)
                                        ++found_widgets;
                                    }
                                )
                        }
                    })
            }).then(() => {
                cy.wrap(found_widgets).should('eq', getSlotWidgets().length, 'each widget needs a data-test-container-uuid');
            });
    })
}

/**
 * auto Injects tests for Wigets at runtime
 * Downsite this Implimentation needs to know what Widgets 
 * are Pressent before the Tests are run.
 * @param {*} source 
 * @param {*} prepareTest 
 */
const testWidgetsLegacy = (source, prepareTest) => {
    testWidgetsArePresent(source)
    injectWidgets(source, prepareTest)
}

const summarizeWidgets = (entries) => {
    const subset = {}
    for (const x of entries) {
        const name = x.name
        const face = x.face
        const data_test_container = `widgets/${name}/${face}`
        if (!(data_test_container in subset)) {
            subset[data_test_container] = 0
        }
        subset[data_test_container] += 1
    }
    return subset;
}

const testWidgetsIsPresent = (uuid, name, face) => {
    cy.log('Yielded from store', uuid, name, face)
    const data_test_container = `widgets/${name}/${face}`
    cy.get(`[data-test-container="${data_test_container}"][data-test-container-uuid="${uuid}"]`)
}






export {
    testWidgets, injectWidgets, testWidgetsArePresent, getTestMap,
    testWidgetsIsPresent, summarizeWidgets

};


