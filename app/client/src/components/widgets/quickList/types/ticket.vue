<template>
  <v-card flat v-if="item && item._id">
    <v-card-text>
      <div v-if="!item.alert">
        <h1 style="line-height: 1.4em">{{ item.title }}</h1>
      </div>
      <v-chip v-for="tag in item.tags" :color="'grey'">{{ tag }}</v-chip>
      <div v-if="item.alert">
        <v-alert :color="item.alert.color">
          <h1>{{ item.alert.content }}</h1>
        </v-alert>
      </div>



      <v-text-field label="CC" hint="Trag hier ewas ein" class="mt-5" />

      <v-text-field label="Subject" hint="Trag hier ewas ein" class="mt-5" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    required: true
  },
  docUUID: {
    type: String,
    required: true
  },
  props: {
    type: Object,
    default: ({})
  },
});
const item = ref({});
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    item.value = val;
  });
onMounted(() => { });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
