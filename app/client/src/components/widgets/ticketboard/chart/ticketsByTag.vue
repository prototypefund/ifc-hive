<template>
  <div v-if="props.uuid">
    <apexchart
      width="80%"
      :type="data.type"
      :options="data.options"
      :series="data.series"
    ></apexchart>
  </div>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import { splitIdentifier, filterData } from "../lib/helper.js";
const props = defineProps({
  props: {
    type: Object,
  },
  uuid: {
    type: String,
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
onMounted(() => {});
onUnmounted(() => {
  dataSubscriber$.unsubscribe();
});
</script>
