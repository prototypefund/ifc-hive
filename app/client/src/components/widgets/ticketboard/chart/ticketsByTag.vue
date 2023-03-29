<template>
  <div v-if="props.uuid && isReady" data-test-container="widgets/ticketboard/chart/ticketsByTag"
    :data-test-container-uuid="props.uuid">
    <apexchart width="100%" :type="data.type" :options="data.options" :series="data.series"></apexchart>
  </div>
</template>
<script setup>
import { inject, ref, shallowRef, onMounted, onUnmounted } from "vue";
import { splitIdentifier, filterData } from "../lib/helper.js";
const props = defineProps({
  props: {
    type: Object,
  },
  uuid: {
    type: String,
    required: true,
  },
});
const data = ref({
  type: "radar",
  options: {
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.1,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: [],
    },
  },
  series: [],
});
const isReady = shallowRef(false)
const $store = inject("$store");
const makeCategories = function (items) {
  if (props.props.categories.length > 0) {
    data.value.options.xaxis.categories = props.props.categories;
    data.value.series = [
      {
        name: "tasks",
        data: [],
      },
    ];
    data.value.options.xaxis.categories.forEach((identifier) => {
      const id = splitIdentifier(identifier);
      data.value.series[0].data.push(filterData(id, [], items).length);
    });
  }
};
const dataSubscriber$ = $store
  .select((state) => state.data)
  .subscribe((val) => {
    makeCategories(val);
  });
onMounted(() => {
  window.setTimeout(() => {
    isReady.value = true
  }, 400)
});
onUnmounted(() => {
  dataSubscriber$.unsubscribe();
});
</script>
