<template>
  <div v-if="props.uuid && isReady" data-test-container="widgets/journal/chart/example"
    :data-test-container-uuid="props.uuid">
    <apexchart width="100%" :type="data.type" :options="data.options" :series="data.series"></apexchart>
  </div>
</template>
<script setup>
import { inject, ref, onMounted, shallowRef, onUnmounted } from "vue";
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

const isReady = shallowRef(false)
const $store = inject("$store");
const state = ref({});
onMounted(() => {
  window.setTimeout(() => {
    isReady.value = true
  }, 400)
});
onUnmounted(() => { });
</script>
