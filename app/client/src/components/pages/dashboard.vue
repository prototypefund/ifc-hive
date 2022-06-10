<template>
    <v-container v-if="state">
        <h1>{{ $t(state.routeName) }} - {{ state.title }}</h1>
        <p>url params > {{ urlParams }} &lt; click value {{ state.count }}</p>
        <v-btn @click="counter">addCount</v-btn>
        <v-btn @click="addWidget">addWidget</v-btn>
        <pre> {{ state }}</pre>

    </v-container>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from 'vue'
const $store = inject('$store')
const state = ref({})
const stateSubscriber = $store.select(state => state.currentPage).subscribe(val => {
    state.value = val
})
defineProps({
    urlParams: {
        type: String,
        default: 'moin'
    }
})

onMounted(() => {
    console.log(`The initial count is ${state.count}.`)
})
onUnmounted(() => {
    stateSubscriber.unsubscribe()
})
function counter() {
    $store.dispatch({
        type: 'updateCurrentPage',
        payload: {
            count: state.value.count + 1 || 0
        }
    });
}
const addWidget = () => {

}
</script>