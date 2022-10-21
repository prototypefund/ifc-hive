import { inject } from 'vue';

const initStore = () => {
  const $store = inject("$store");
  $store.dispatch({
    type: `init`,
    payload: {}
  });
}

const prepareStore = (name, args) => {
  args.value = Math.floor(Math.random() * 100);
  args[`random_noise_0${Math.floor(Math.random() * 100)}`] = args.value;
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
