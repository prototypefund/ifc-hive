<template>
  <div>
    <apexchart
      height="80%"
      :type="data.type"
      :options="data.options"
      :series="data.series"
    ></apexchart>
  </div>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const props = defineProps({
  props: {
    type: Object,
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_chart";
    },
  },
  widgetUUID: {
    type: String,
    required: true,
  },
});
const data = ref({
  type: "polarArea",
  options: {
    stroke: {
      colors: ["#fff"],
    },
    fill: {
      opacity: 0.8,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  },
  series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
});

const $store = inject("$store");
const state = ref({});
onMounted(() => {});
onUnmounted(() => {});
</script>
