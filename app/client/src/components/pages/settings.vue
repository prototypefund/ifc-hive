<template>
  <v-container v-if="state">
    <h1>{{ $t(state.routeName) }} - {{ state.title }}</h1>
    <p>url params > {{ props.urlParams }} &lt;</p>
    <Grid :contents="state.slots"></Grid>
  </v-container>
</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted, defineAsyncComponent } from "vue";
const $store = inject("$store");
const state = shallowRef({});
const Grid = shallowRef();
const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });
const gridSubscriber$ = $store
  .select((state) => state.currentPage.grid)
  .subscribe((val) => {
    if (val) {
      Grid.value = defineAsyncComponent((props) => {
        //TODO find out why vite alias dont work. Add try catch here
        return import(`../templates/grids/${val}.vue`);
      });
    }
  });
const props = defineProps({
  urlParams: {
    type: String,
    default: "default param",
  },
});

onMounted(() => {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: false,
    },
  });
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  gridSubscriber$.unsubscribe();
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: true,
    },
  });
});
function counter() {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      count: state.value.count + 1 || 0,
      loading: true,
    },
  });
}
</script>
