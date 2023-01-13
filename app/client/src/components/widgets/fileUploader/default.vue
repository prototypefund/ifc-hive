<template>
  <v-card
    v-if="state && props.uuid"
    data-test-container="widgets/fileUpload/default"
    :data-test-container-uuid="props.uuid"
  >
    <upload-dashboard v-if="uppy" :uppy="uppy" :props="state.optionsDashboard" />
    <pre>{{ state }}</pre>
  </v-card>
</template>
<script setup>
import { inject, ref, shallowRef, onMounted, onUnmounted, defineComponent } from "vue";
// uppy css
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { uppyBakery } from "@lib/uppyHelper";
import { Dashboard } from "@uppy/vue";
const $store = inject("$store");
const state = ref({});
const uppy = shallowRef(false);
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
const handleUppy = () => {
  if (!uppy.value) {
    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        optionsProgressBar: {
          id: "progressBar_" + props.uuid,
        },
        optionsDashboard: {
          id: "dashboard_" + props.uuid,
        },
      },
    });
    // create an uppy instance and remember it in the uppyBakery Store so we can restore uppy instances from everywhere
    uppy.value = uppyBakery(props.uuid, state.value);
    const payload = {};
    // put all the needed configs in our global uploader state object. We will use this to configure the status bar in app.vue and do other shit with it
    payload[props.uuid] = {
      id: props.uuid,
      optionsDashboard: {
        id: "dashboard_" + props.uuid,
        ...state.value.optionsDashboard,
      },
      optionsProgressBar: {
        id: "progressBar_" + props.uuid,
        ...state.value.optionsProgressBar,
      },
      optionsStatusBar: {
        id: "statusBar_" + props.uuid,
        ...state.value.optionsStatusBar,
      },
      fileMeta: {
        ...state.value.fileMeta,
      },
    };
    $store.dispatch({
      type: "uploader/add",
      payload: payload,
    });
  }
};
const uploaderSubscriber$ = $store
  .select((state) => state.uploader)
  .subscribe((val) => {
    handleUppy(val);
  });
onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  uploaderSubscriber$.unsubscribe();
});
</script>
