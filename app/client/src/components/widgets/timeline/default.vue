<template>
  <v-row v-if="state && props.uuid" data-test-container="widgets/timeline/default" :data-test-container-uuid=props.uuid>
    <v-col cols="12" md="6" lg="4" color="green">
      <div>
        <v-timeline side="end" align="end" class="mt-5">
          <v-timeline-item size="small">
            <v-card-text class="pa-0">
              mpoin
            </v-card-text>

          </v-timeline-item>
        </v-timeline>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted, computed } from "vue";
import QuickListHandler from "@w/quickList/handler.vue";

const $store = inject("$store");
const state = ref({});
const current = ref({ id: false });

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });

const props = defineProps({
  props: {
    type: Object,
    default: () => ({}),
  },
  uuid: {
    type: String,
  },
});

onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>

<style lang="css">
.v-timeline .v-timeline-divider__dot {
  background: #e4e4e4;
}

.v-timeline-divider__dot--size-small {
  height: 20px;
  width: 20px;
}
</style>
