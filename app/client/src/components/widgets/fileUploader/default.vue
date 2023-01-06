<template>
  <v-card v-if="state && props.uuid" data-test-container="widgets/fileUpload/default"
    :data-test-container-uuid="props.uuid">
    <upload-dashboard :uppy="uppy" :props="state.optionsDashboard"></upload-dashboard>
    <pre>{{ state }}</pre>
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, computed, defineComponent } from "vue";
// uppy css
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
// uppy js
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { Dashboard } from "@uppy/vue";

const $store = inject("$store");
const state = ref({});

const uploadDashboard = defineComponent(Dashboard);
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const props = defineProps({
  props: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  uuid: {
    type: String,
    required: true,
  },
});
const uppy = computed(function () {
  // TODO implement all possible config values visit: https://uppy.io/docs/uppy/
  // add the uuid of our widget to the uppy options so that the uppy instance has the same name
  //state.value.optionsUppy.id = props.uuid;
  console.warn("add meta info for image uploads per widget instance");
  //state.value.optionsUppy.meta = {};
  const uppy = new Uppy(state.value.optionsUppy);
  uppy.use(XHRUpload, state.value.optionsXhrUpload);
  uppy.on("file-added", (file) => {
    uppy.setFileMeta(file.id, state.value.fileMeta);
  });
  return uppy;
});

onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  uppy.value.close({ reason: "unmount" });
});
</script>
