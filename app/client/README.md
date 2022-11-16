# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

# Mini-RX-Store
[Here](https://github.com/spierala/mini-rx-store) you find the documentation of the Mini-ry-Store store Framework.
If you feel fancy and want to brag about cool stuff you know, [visit the redux documentation](https://redux.js.org/api/api-reference) to learn cool stuff which you might want to use after a while using this framework

# Vuetify3
[Here](https://next.vuetifyjs.com/en/) you find the documentation of the Vuetify3 UI-Component Library

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### Full recommended extensionlist
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


# Developer How To
## Basic Idea
The whole application, based on vue3, vuetify and the mini-rx-store is loosely coupled and communicates just via state changes triggered by the mini-rx-store. Therefore we advice not to use standard vue data attributes or props if you want to access these across the platform or keep them after page navigations.

## Important to Know
Whilst you are basically pretty free to setup configurations for you pages and widgets as you see fit, there are some required ones which are usually preset to default values if no seperate conf file, which overrides the system default, is provided. It's also important to know that every component and every piece of data is referenced by uuids. Those uuid's however are generated automatically as long as you do not provide a name attribute in your configs. If you do so, be aware that also a selfset name needs to be unique if you do not wish to have the same instance of page or widget in multiple locations.

## Creating you own page
### Folder structure
To locate all the current pages and to create you own, navigate to 
```
src/components/pages
```
The best starting point from there is to take a look into the boilerplate folder.
All Pages are structured in the same way which must not be violated. A page always contains out of the following files
```
├── myPageName
│   ├── component.cy.js // contains the cypress tests
│   ├── conf.js // optional, contains page specific config which override default conf
│   ├── page.vue // the actual code
└── └── story.js // a storyfile for storybook
```

#### page.vue
Here we see the most important things you definitely need to do to get your page working.

```
<v-container v-if="state" data-test-container="pages/boilerplate" fluid pa-0>
    <Grid v-if="state.slots" />
```
At first note that, whatever main rapping element you choose, you must have a v-if="state" in there to prevent false rendering. We also encourage you to use the same naming scheme and concept as we do. Every component, may it be template, widget, page or whatnot should provide a "data-test-container" attribute in it's main DOM element. The value of this attribute should be according to it's file path as from "components/"

We also encourage you to use the Vue3 Compose API over the Options API

The "Grid" component will provide you a blackbox you should not think about too much, it simply allows the user to customize the appearance of the pages contents. You on the otherhand may just provide additional information or functionallity within the page file which is unique to this page and cannot be a widget

The rest of the code within the boilerplate/page.vue must be kept in order to have a working base for you page. Note that the subscriber variables alway end on an $ which signalizes that the content of this variable is a redux observable and therefore needs to be unsubscribed whenever you leave the page to prevent memory leaks.

#### conf.js

#### component.cy.js

#### story.js

### Store

#### Configuration
Take me to [the Page default config](#pageConfig)

#### Usage




## Creating you own widget
### Folder structure

### Boilerplate

### Store

#### Configuration
Take me to [the Page default config](#pageConfig)
#### Usage


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
Note that you can add as much parameters, apart from the above, as you like. 

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
    "face": false
}
```
Note that you can add as much parameters, apart from the above, as you like. 


# Test Preperation
If you want to run 2 non-headless sessions simultanusly make sure to select diffrent Browsers
```
docker-compose up --build -d
cd app/client
```

## Integration Test non-headless for Development or Debuging
Runs a Test against the RAW app via with Browser For Test Development/Debuging
1) -> Test Preperation 
```
yarn test:integration
```

## Integration Test Headless 
Runs a Test against the RAW app via Comandline
1) -> Test Preperation
```
yarn test:integration:ci
```

## Component Storybook Test non-headless for Development or Debuging
Runs a Test against the Storybook RAW app via Comandline
```
yarn test:component
```
## Component Storybook Test Headless
```
yarn test:component:ci
```