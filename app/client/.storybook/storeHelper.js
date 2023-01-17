import { inject } from 'vue';

/**
 * Used by Storybook book 
 */
const initStore = () => {
  const $store = inject("$store");

  $store.dispatch({
    type: `init`,
    payload: {}
  });

  if (window.Cypress && (!window.__widgets || !window.__currentPage || !window.__store)) {
    window.__store = false
    window.__widgets = false
    window.__currentPage = false

    $store.select(state => state.currentPage).subscribe((state) => {
      window.__currentPage = state
    })
    $store.select(state => state.widgets).subscribe((state) => {
      window.__widgets = state
    })

    $store.select(state => state).subscribe((state) => {
      window.__store = state
    })
  }

  if (window.Cypress && window.Cypress.__store == undefined) {
    window.Cypress.__store = false
    $store.select(state => state).subscribe((state) => {
      window.Cypress.__store = JSON.parse(JSON.stringify(state))
    })
  }

}

const prepareStore = (name, args) => {
  const $store = inject("$store");
  const routeName = `app.${name}`
  $store.dispatch({
    type: "pages/add",
    routeName,
    payload: args,
  });
  $store.dispatch({
    type: "currentPage/set",
    routeName,
    payload: args,
  });
}

const dispatchStore = (name, type, args) => {
  const $store = inject("$store");
  const routeName = `app.${name}`
  $store.dispatch({
    type: type,
    routeName,
    payload: args,
  });
}

const wrapComponent = (component, wrapper) => {
  console.log(`<${wrapper} flat><${component} v-bind="args.props"/></${wrapper}>`)
  return `<${wrapper} flat><${component} v-bind="args.props"/></${wrapper}>`
}
const wrapFullPage = (component, wrapper) => {
  return `<${wrapper}  is-in-test=1><${component} v-bind="args.props"/></${wrapper}>`
}
export { initStore, prepareStore, dispatchStore, wrapComponent, wrapFullPage };
