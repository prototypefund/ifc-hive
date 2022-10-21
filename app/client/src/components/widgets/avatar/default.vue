<template>
  <v-timeline v-if="state && props.uuid">
    <h3>{{ state.title }}</h3>
    <v-card dot-color="red-lighten-1" fill-dot size="x-small">
      <v-card-title class="bg-amber-lighten-1 justify-end">
        <h2 class="mr-4 font-weight-light">widget state</h2>
        <v-icon size="large" icon="mdi-home-outline"></v-icon>
      </v-card-title>
      <form @submit.prevent="">
        <p>state.entries</p>
        <v-card-text v-for="(entry, index) in state.entries" :key="index" size="small" style="text-align: left">
          {{index}} : {{entry.content}}
        </v-card-text>
        <p>state.person</p>
        <v-card-text v-for="(entry, index) in state.person" :key="index" size="small" style="text-align: left">
          {{index}} : {{entry}}
        </v-card-text>
        <div>
          <p v-if="state.inputErrors && state.inputErrors.length" data-test-id="widget_avatar-inputErrors">
            <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in state.inputErrors" :key="index">{{ error }}</li>
          </ul>
          </p>
        </div>
        <p>props.props.person</p>
        <v-card-text v-for="(entry, index) in props.props.person" :key="index" size="small" style="text-align: left">
          {{index}} : {{entry}}
        </v-card-text>

        <div class="form-group row m-1">
          <div class="col-sm border">
            <label class="row m-2 col-form-label" for="name">First name:</label>
            <input class="form-control" placeholder="First name" type="text" id="firstname" name="firstname"
              v-model="firstname" size="10" /> <!-- :disabled="!editmode" -->
          </div>
          <div class="col-sm border">
            <label class="row m-2 col-form-label" for="name">Last name:</label>
            <input class="form-control" placeholder="Last name" type="text" id="name" name="name" v-model="name"
              size="10" data-testid="name" />
          </div>
        </div>
        <div class="form-group row m-1">
          <div class="col-sm border">
            <label class="row m-2 col-form-label" for="email">Email:</label>
            <input class="form-control" placeholder="Email" type="email" id="email" name="email" v-model="email"
              size="20" data-testid="email" />
          </div>
        </div>
      </form>
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
    type: Object
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
      data
    },
  });
};


const firstname = computed({
  get() {
    return state.value.data.firstname;
  },
  set(firstname) {
    dataUpdater({
      firstname
    });
  },
});
const name = computed({
  get() {
    return state.value.data.name;
  },
  set(name) {
    dataUpdater({
      name
    });
  },
});
const email = computed({
  get() {
    return state.value.data.email;
  },
  set(email) {
    dataUpdater({
      email
    });
  },
});
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
