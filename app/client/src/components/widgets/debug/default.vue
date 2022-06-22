<template>
    <v-card v-if="state">
        <pre>{{ state }}</pre>
    </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from 'vue'
const $store = inject('$store')
const state = ref({})
const stateSubscriber = $store.select(state => state.currentPage).subscribe(val => {
    state.value = val

})
const props = defineProps({
    props: {
        type: Object,
        required: true
    },
    uuid: {
        type: String,
        required: true
    }
})

onMounted(() => {

})
onUnmounted(() => {
    stateSubscriber.unsubscribe()
})
</script>