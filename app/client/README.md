# pacifico-projectjournal-client

This template should help get you started developing with Vue 3 in Vite. The
template uses Vue 3 `<script setup>` SFCs, check out the [script setup
docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn
more.

## Mini-RX-Store
[Here](https://github.com/spierala/mini-rx-store) you find the documentation of
the Mini-ry-Store store Framework. If you feel fancy and want to brag about cool
stuff you know, [visit the redux documentation](https://redux.js.org/api/api-reference) to learn cool stuff which
you might want to use after a while using this framework

## Vuetify3
[Here](https://next.vuetifyjs.com/en/) you find the documentation of the Vuetify3 UI-Component Library



## Developer How To

### Basic Idea
The whole application, based on vue3, vuetify and the mini-rx-store is loosely
coupled and communicates just via state changes triggered by the mini-rx-store.
Therefore we advice not to use standard vue data attributes or props if you want
to access these across the platform or keep them after page navigations.

### Important to Know
Whilst you are basically pretty free to setup configurations for you pages and
widgets as you see fit, there are some required ones which are usually preset to
default values if no seperate conf file, which overrides the system default, is
provided. It's also important to know that every component and every piece of
data is referenced by uuids. Those uuid's however are generated automatically as
long as you do not provide a name attribute in your configs. If you do so, be
aware that also a selfset name needs to be unique if you do not wish to have the
same instance of page or widget in multiple locations.

### Creating you own page

### Folder structure
To locate all the current pages and to create you own, navigate to 
```
src/components/pages
```
The best starting point from there is to take a look into the boilerplate
folder.All Pages are structured in the same way which must not be violated. A
page always contains out of the following files
```
├── myPageName
│   ├── component.cy.js // contains the cypress tests
│   ├── conf.js // optional, contains page specific config which override default conf
│   ├── page.vue // the actual code
└── └── story.js // a storyfile for storybook
```

#### page.vue
Here we see the most important things you definitely need to do to get your page
working.

```
<v-container v-if="state" data-test-container="pages/boilerplate" fluid pa-0>
    <Grid v-if="state.slots" />
```
At first note that, whatever main rapping element you choose, you must have a
v-if="state" in there to prevent false rendering. We also encourage you to use
the same naming scheme and concept as we do. Every component, may it be
template, widget, page or whatnot should provide a "data-test-container"
attribute in it's main DOM element. The value of this attribute should be
according to it's file path as from "components/"

We also encourage you to use the Vue3 Compose API over the Options API

The "Grid" component will provide you a blackbox you should not think about too
much, it simply allows the user to customize the appearance of the pages
contents. You on the otherhand may just provide additional information or
functionallity within the page file which is unique to this page and cannot be a
widget

The rest of the code within the boilerplate/page.vue must be kept in order to
have a working base for you page. Note that the subscriber variables alway end
on an $ which signalizes that the content of this variable is a redux observable
and therefore needs to be unsubscribed whenever you leave the page to prevent
memory leaks.

If the page contains other views, such as a edit dialogue etc which you don't
want to open in an overlay but rather in an persistent toolbar, refer to the
section "toolbar"

#### conf.js

The conf.js file contains the configuration for the layout and widgets pressent
on your page

You can define what kind of grid you need with Grid Key.


```javascript

{
    // grid defines the used grid
  grid: {
		type: "default",
		items: "card",
   		columns: 2
	},
  // this will determine if we always scroll to the last page position or to the top whenever we enter this page
  scrollTop: false,
	// title defines the title of the page
	title: 'My Title',
    // slots array defines the used widgets within the grid
  slots: [
      // first slot 
      {
      column: 6,
      widget: {
        name: "myCategory",
        props: {
          title: "widget title"
        }
      }
    },
  ]
}
```

If you don't want to use the grid but instead place widgets manually in your
page you can set you config like so

```javascript
{
  grid: false,
  slots: false,
  tools:[
    {
      //list of tools
    }
  ],
  widgets: [{ // you can also bypass the grid or use widgets directly in the page via the pageloader. This is fully optional
    uuid: "mySpecialPageWidget"
    name: "myCategory",
    props: {
      title: "widget title"
    }  
  }],
}
```

#### component.cy.js

The component.cy.js contains the test Code for your page, it is also used to
trigger the test for all widgets present on your Page. Your Test code must
provide a `prepareTest`function, it is used to navigate to the page you want to
test.

How you navigate to your test case depends on the test environment, there is the
case component or integration test. In the case of the component test, the tests
run against Storybook, in the case of the integration test, runs against the
application directly.

The [Boilerplate](./src/components/pages/boilerplate/component.cy.js) prepareTest function looks like this.

```javascript
const source = 'pages/boilerplate'
const prepareTest = () => {
  if (isComonentTest()) {
    // visit Storybook see story.js
    cy.visitStorybook(source, 'Headless')
  } else {
    // visit the path where the boilerplate is located
    cy.visit("/boilerplate"); // eine route anlegen ?
  }
}
```

Your Test code for the Page is inside the 'describe' block.

In the [Boilerplate](./components/pages/boilerplate/component.cy.js) Example the
Test that `This is a Page Boilerplate` text is present on your page.

```javascript
 it("Boilerplate has Text ", () => {
    cy.get('[data-test-container="pages/boilerplate"]')
      .should('contain.text', 'This is a Page Boilerplate')
  });
```

Once your Pages tests are done, the `testWidgets(source, prepareTest)` will
trigger the Widget Test.

The testWidgets function will then use the `data-test-container`passed by source
to identify your page and run the widgets found on your page. 

## TODO Umgang mit visit.json 

**Notes: **

* The **`source`** ( in our example `pages/boilerplate` ) has to match your Pages container id !
* The **`source`** should match your Storybook title.

#### story.js

In the `story.js` the environment for the components for the storybook is
created, which are to be used in the component tests. A title must be defined in
the standard export block. The component will then appear in the storybook under
this title. Please look up the example in the `pages/boilerplate/story.js`

```javascript
export default {
  title: 'pages/boilerplate',
  argTypes: {
  },
};
```

Afterwards, a template must be created with which Storybook should initialize the component.

```javascript
const HeadlessTemplate = (args) => ({
    components: { comp },
    setup() {
        initStore()
        prepareStore('BOILERPLATE', args)
        return { args };
    }, 
    template: wrapComponent('comp', 'v-card'),
});
```

In order for a component to appear, the Temperate must be initialized.

```javascript
export const Headless = HeadlessTemplate.bind({});
Headless.args = conf;
```

To be able to address the component in a test, the title and the variable name are used.

**Note: The title and the variable name are case sensitive.**

```javascript
// inside your component.cy.js
cy.visitStorybook('pages/boilerplate', 'Headless') // cy.visitStorybook(title, variable name)
```

### Store

#### Configuration
Take me to [the Page default config](#pageConfig)



## Creating you own widget

### Folder structure
To locate all the current widgets and to create you own, navigate to 
```
src/components/widgets
```
The best starting point from there is to take a look into the boilerplate folder.
All Widgets are structured in the same way which must not be violated. A widget always contains out of the following files
```
├── myWidgetName
│   ├── default.vue // the actual code of the default widget
│   ├── default.component.cy.js // contains the cypress tests for the default widget
│   ├── FACENAME.vue // optional, the actual code of specific widget face 
│   ├── FACENAME.component.cy.js // optional, contains the cypress tests for the FACE widget
│   ├── conf.js // optional, contains page specific config which override default conf
│   ├── story.js // a storyfile for storybook
│   └── TYPE // a folder containing widget files to be used in the toolbar
│       ├── FACENAME.vue // optional, the actual code of specific widget face 
└────── └── FACENAME.component.cy.js // optional, contains the cypress tests for the FACE widget
```

### default.vue/FACE.vue

Here we see the most important things you definitely need to do to get your widget working.

```
<v-card v-if="state && props.uuid" data-test-container="widgets/boilerplate/default" :data-test-container-uuid=props.uuid>
```

At first note that, whatever main rapping element you choose, you must have a
v-if="state && props.uuid" in there to prevent false rendering. We also
encourage you to use the same naming scheme and concept as we do. Every
component, may it be template, widget, page or whatnot should provide a
"data-test-container" attribute in it's main DOM element. The value of this
attribute should be according to it's file path as from "components/"

To be able to test a specific widget we also need to add a
"data-test-container-uuid" which contains the widgets uuid which by default we
obtain from the props 
We also encourage you to use the Vue3 Compose API over the Options API

The rest of the code within the boilerplate/default/FACE.vue must be kept in
order to have a working base for your widget (the iLike and title vars and form
elements are just for showcase purposes and may be removed). Note that the
subscriber variables alway end on an $ which signalizes that the content of this
variable is a redux observable and therefore needs to be unsubscribed whenever
you leave the page to prevent memory leaks.

### Store
Take me to [the Widget default config](#widgetConfig)



## Default Configurations for application concepts

### <a name="pageConfig"></a>Required page configuration:

```json
{
// will be set based on the name of the vue router route you've used, or whatever you configure in your route file
    "routeName": "Vue3routeName",
// will usually be set automatically, if set manually, be aware that duplicated uuid lead to shared page store
    "uuid": false,
// obvious
    "loading": true,
// grid config for a page
    "grid": {
// defines the wrapping html template for the whole grid
        "type": "default",
// defines the wrapping html template for the single item within the grid
        "items": "card",
// defines the amount of columns per row
        "columns": 3
    },
// the array containing the configs for the 1-n slots
    "slots": [
        {
// defines a css class which will be used for the v-col the slot widget is housed in
            "class": false,
// defines the width of the widget by using flexbox grid col numbers 1-12
            "column": 12,
// defines the widget configuration, see widget storePattern
            "widget": {}
        }
    ]
}
```
Note that you can add as many parameters as you like, apart from ones the above.

### <a name="widgetConfig"></a>Required widget configuration:

```json
{
// should usually be a i18n key
    "title": false,
// will usually be set automatically, if set manually, be aware that duplicated uuid lead to shared widget store
    "uuid": false,
// the type of widget which represents a folder name under widgets and a config
    "name": false,
// the specific .vue file for the widget, by default a file called default is needed
    "face": false,
// a deeper abstractation level for widgets which are used as tools. ie. type:'add' create a folder called 'add' and create a default.vue or FACE.vue containing your add logic for a given widget
    "type": false
}
```
Note that you can add as much parameters, apart from the above, as you like. 

## Toolbar

Every widget you create can also be used as a tool lauched from the toolbar. To
do so simply go to the file which shall provide said function. Usually I'd
recommend you to do this in the page.vue file or if you wan't it global die
App.vue.

To add a widget as a tool use the following command in your source File

```js
// either $store or this.$store depending if you use options or compose API
  $store.dispatch({
    type: "toolbar/add",
    payload: {
// the title to use in the toolbar next to the icon. Should be an i18n key
      title: 'newJournal',
// a whitlist field. If set the tool will just be visible on a page with the configured routeName, if false or not set the tool will be visible everywhere. You can also add as many route names as you like, seperated by whatever
      page: 'app.journal;app.ticketBoard',
// a mdi icon you want for the inactive state      
      icon: 'mdi-content-save-edit-outline',
// a mdi icon you want for the active state
      iconActive: 'mdi-content-save-edit',
// a normal widget config object which follows the same principle as all the widget configs.
      widget: {
        name: 'journal',
        type: 'add',
// make sure to provide a uuid if you don't want to have multiple instances of a given tool (multiple instances might be buggy atm)
        uuid: 'journal_add'
      }
    },
  });
```

## Test preparation

If you want to run 2 non-headless sessions simultaneously make sure to select different Browsers

```
docker-compose up --build -d
cd app/client
```

## Integration Test non-headless for Development or Debugging

Runs a Test against the RAW app via with Browser For Test Development/Debugging

1. -> Test Preparation

```
yarn test:integration
```

## Integration Test Headless

Runs a Test against the RAW app with your favorite Terminal

1. -> Test Preparation

```
yarn test:integration:ci
```

## Component Storybook Test non-headless for Development or Debugging

Runs a Test against the Storybook RAW app with your favorite Terminal

```
yarn test:component
```

## Component Storybook Test Headless

```
yarn test:component:ci
```

Work flow Create Dynamic Imported Widget tests for new page called lets call it`MYPAGE`.
We start with the Cypress for integration.

1. copy and rename the page boilerplates (`_boilerplate.vue` and `_boilerplate.component.cy.js `) 
2. adapt the URL/endpoints in the prepareTest() function in `MYPAGE.component.cy.js`
3. create an empty definition in your "API/Database" (now visit.json)
4. restart the Cypress for integration `->` Test will fail, if there are widgets in the definition but not on the page. 
5. add your widgets to the definition in your "API/Database"  (now visit.json) 
6. restart the Cypress for integration `->` Test will fail if there is no test template for the widget.
7. copy and rename the widget template `_boilerplate.component.template.cy.js`
8. writing the test template
9. redo Cypress E2E and fix your Errors until tests passes.
10. restart the Cypress for Storybook `->` Test will fail, if `MYPAGE.stories.js` is missing, fix it.
11. restart the Cypress with Integration

## Recommended IDE Setup

### VSCode

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

Full recommended extensionlist

```
code --install-extension aaron-bond.better-comments
code --install-extension bierner.color-info
code --install-extension christian-kohler.npm-intellisense
code --install-extension christian-kohler.path-intellisense
code --install-extension dbaeumer.vscode-eslint
code --install-extension ecmel.vscode-html-css
code --install-extension esbenp.prettier-vscode
code --install-extension formulahendry.auto-close-tag
code --install-extension formulahendry.auto-rename-tag
code --install-extension Marko-JS.marko-vscode
code --install-extension mikestead.dotenv
code --install-extension MisterJ.vue-volar-extention-pack
code --install-extension ms-azuretools.vscode-docker
code --install-extension MS-CEINTL.vscode-language-pack-de
code --install-extension ms-vscode-remote.remote-containers
code --install-extension ms-vscode-remote.remote-ssh
code --install-extension ms-vscode-remote.remote-ssh-edit
code --install-extension ms-vscode.remote-explorer
code --install-extension Natizyskunk.sftp
code --install-extension naumovs.color-highlight
code --install-extension oliversturm.fix-json
code --install-extension redhat.java
code --install-extension sdras.vue-vscode-snippets
code --install-extension sibiraj-s.vscode-scss-formatter
code --install-extension steoates.autoimport
code --install-extension stylelint.vscode-stylelint
code --install-extension syler.sass-indented
code --install-extension VisualStudioExptTeam.intellicode-api-usage-examples
code --install-extension VisualStudioExptTeam.vscodeintellicode
code --install-extension vscjava.vscode-java-debug
code --install-extension vscjava.vscode-java-dependency
code --install-extension vscjava.vscode-java-pack
code --install-extension vscjava.vscode-java-test
code --install-extension vscjava.vscode-maven
code --install-extension Vue.volar
code --install-extension Wscats.vue
code --install-extension xabikos.JavaScriptSnippets
code --install-extension yzhang.markdown-all-in-one
```
