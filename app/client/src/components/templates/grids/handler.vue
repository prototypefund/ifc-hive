<template>
  <pre>{{ props }}</pre>
  <!--Grid :contents="props.contents" /-->
</template>
<script setup>
import { inject, shallowRef, onUnmounted, defineAsyncComponent } from "vue";
import gridLoader from "@lib/gridLoader";
const $store = inject("$store");
const Grid = shallowRef();
const props = defineProps({
  contents: {
    type: Object,
    required: true,
  },
  grid: {
    type: String,
    required: true,
  },
});
const gridSubscriber$ = $store
  .select((state) => state.currentPage.grid)
  .subscribe((val) => {
    Grid.value = defineAsyncComponent((props) => {
      return gridLoader(val);
    });
  });

onUnmounted(() => {
  gridSubscriber$.unsubscribe();
});
</script>
