<template>
    <div>
        <apexchart width="500" type="bar" :options="data.options" :series="data.series"></apexchart>
    </div>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const data = ref({
    options: {
        chart: {
            id: 'vuechart-example'
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
    },
    series: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
    }]
});

const $store = inject("$store");
const state = ref({});
onMounted(() => { });
onUnmounted(() => {

});
</script>