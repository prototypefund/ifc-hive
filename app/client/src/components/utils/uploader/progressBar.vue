<template>
  <v-row no-gutters v-if="bars">
    <v-col v-for="bar in bars">
      <upload-status
        :uppy="bar.instance"
        :props="bar.config.optionsProgressBar || {}"
      ></upload-status>
    </v-col>
  </v-row>
</template>
<script setup>
import { inject, ref, defineComponent, onMounted, onUnmounted } from "vue";
import { uppyBakery } from "@lib/uppyHelper";
import { ProgressBar } from "@uppy/vue";
import "@uppy/progress-bar/dist/style.css";
const $store = inject("$store");
const state = ref({});
const bars = ref(false);
const uploadStatus = defineComponent(ProgressBar);
const handleProgressBars = function () {
  const uploaderInstances = Object.keys(state.value);
  uploaderInstances.forEach((key) => {
    if (!bars.value) {
      bars.value = {};
    }
    if (!bars.value[key]) {
      bars.value[key] = {
        id: key,
        config: state.value[key],
        instance: uppyBakery(key, state.value[key]),
      };
    }
  });
};

const stateSubscriber$ = $store
  .select((state) => state.uploader)
  .subscribe((val) => {
    state.value = val;
    handleProgressBars();
  });

onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>

<style lang="css"></style>
