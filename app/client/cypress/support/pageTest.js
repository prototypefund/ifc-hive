import { isComonentTest } from './sbHelper.js'
import { testWidgets } from './testHelper.js'

class PageTest {

    static PagePattern = /(pages\/.*)\/component\.cy\..*/

    static getCaller() {
        const fname = `${Cypress.mocha.getRunner().suite.file}`;
        // Optional or use callside...
        // const fname = `${new Error().stack}`.split('\n')[1];
        var sourceArray = fname.match(PageTest.PagePattern);
        if (!sourceArray) {
            throw new Error(`Can\'t detect Page for File ${fname}`)
        }
        return sourceArray[1];
    }

    /**
     * 
     * @param {*} storybookTitle 
     * @param {*} storybookName 
     * @param {*} route 
     */

    constructor (storybookTitle, storybookName, route) {
        if (storybookTitle == undefined) {
            storybookTitle = PageTest.getCaller()
            // throw new Error("storybookTitle is undefined");
        }
        this.storybookTitle = storybookTitle;
        this.storybookName = storybookName == undefined ? 'Headless' : storybookName;
        if (route == undefined) {
            this.route = storybookTitle.split("/")[1];
        }
    }

    getTitle() {
        return this.storybookTitle;
    }

    getDescription() {
        return `Visit ${this.getTitle()}`;
    }

    getRoute() {
        return this.route;
    }

    prepareTest() {
        if (isComonentTest()) {
            cy.visitStorybook(this.storybookTitle, this.storybookName);
            console.log('LOAD')
        } else {
            cy.visit(this.route);
        }
    }

    testWidgets() {
        testWidgets(this.storybookTitle, this.prepareTest)
    }
}


export { PageTest }