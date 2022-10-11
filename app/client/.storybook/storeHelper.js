import { inject } from 'vue';

function initStore() {
  const $store = inject("$store");
  $store.dispatch({
    type: `init`,
    payload: {}
  });
}

function prepareStore(name, args) {
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

export { initStore, prepareStore };
