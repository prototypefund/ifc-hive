# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

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

# Developer How To
## Basic Idea
The whole application, based on vue3, vuetify and the mini-rx-store is loosely coupled and communicates just via state changes triggered by the mini-rx-store. Therefore we advice not to use standard vue data attributes or props if you want to access these across the platform or keep them after page navigations.

## Important to Know
Whilst you are basically pretty free to setup configurations for you pages and widgets as you see fit, there are some required ones which are usually preset to default values if no seperate conf file, which overrides the system default, is provided. It's also important to know that every component and every piece of data is referenced by uuids. Those uuid's however are generated automatically as long as you do not provide a name attribute in your configs. If you do so, be aware that also a selfset name needs to be unique if you do not wish to have the same instance of page or widget in multiple locations.

## Creating you own page



## Default Configurations for application concepts
Required page configuration:
```json
{
// will be set based on the name of the vue router route you've used, or whatever you configure in your route file
    routeName: "Vue3routeName",
    // will usually be set automatically, if set manually, be aware that duplicated uuid lead to shared page store
    uuid: false,
// obvious
    loading: true,
// grid config for a page
    grid: {
// defines the wrapping html template for the whole grid
        type: "default",
// defines the wrapping html template for the single item within the grid
        items: "card",
// defines the amount of columns per row
        columns: 3
    },
// the array containing the configs for the 1-n slots
    slots: [
        {
// defines a css class which will be used for the v-col the slot widget is housed in
            class: false,
// defines the width of the widget by using flexbox grid col numbers 1-12
            column: 12,
// defines the widget configuration, see widget storePattern
            widget: {}
        }
    ]
}
```
Note that you can add as much parameters, apart from the above, as you like. 

Required widget configuration:
```json
{
// should usually be a i18n key
    title: false,
// will usually be set automatically, if set manually, be aware that duplicated uuid lead to shared widget store
    uuid: false,
// the type of widget which represents a folder name under widgets and a config
    name: false,
// the specific .vue file for the widget
    face: false,
}
```
Note that you can add as much parameters, apart from the above, as you like. 