<template>
  <v-timeline>
    <v-card
      dot-color="red-lighten-1"
      fill-dot
      size="x-small"
      v-if="state && props.uuid"
      data-test-container="widgets/form/default"
    >
      <h3>{{ state.title }}</h3>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          data-test-id="firstname"
          v-model="firstname"
          :counter="10"
          label="firstname"
          required
        >
        </v-text-field>
        <v-text-field
          data-test-id="name"
          v-model="name"
          :counter="10"
          label="Name"
          required
        ></v-text-field>
        <v-text-field
          data-test-id="email"
          v-model="email"
          label="E-mail"
          required
        ></v-text-field>
      </v-form>
    </v-card>
  </v-timeline>
</template>
<script setup>
import { inject, ref, onMounted, computed, onUnmounted } from "vue";
const $store = inject("$store");
const state = ref({});
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const props = defineProps({
  props: {
    type: Object,
  },
  uuid: {
    type: String,
  },
  /*
    person0: {
      type: Object
    }
  */
});
const dataUpdater = (data) => {
  $store.dispatch({
    type: "widgets/update",
    uuid: props.uuid,
    payload: {
      data,
    },
  });
};

const firstname = computed({
  get() {
    return state.value.data.firstname;
  },
  set(firstname) {
    dataUpdater({
      firstname,
    });
  },
});
const name = computed({
  get() {
    return state.value.data.name;
  },
  set(name) {
    dataUpdater({
      name,
    });
  },
});
const email = computed({
  get() {
    return state.value.data.email;
  },
  set(email) {
    dataUpdater({
      email,
    });
  },
});
onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
