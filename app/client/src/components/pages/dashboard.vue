<template>
    <v-container v-if="state">
        <h1>{{ $t(state.routeName) }} - {{ state.title }}</h1>
        <p>url params > {{ urlParams }} &lt; click value {{ count }}</p>
        <v-btn @click="counter">addCount</v-btn>
        <v-btn @click="addWidget">addWidget</v-btn>
        <pre> {{ state }}</pre>

    </v-container>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from 'vue'
const $store = inject('$store')
const count = ref(0)
const state = ref({})
const stateSubscriber = $store.select(state => state.currentPage).subscribe(val => {
    console.log('dashboardSubscribe')
    count.value = val.count || 0
    state.value = val
})
defineProps({
    urlParams: {
        type: String,
        default: 'moin'
    }
})

onMounted(() => {
    console.log(`The initial count is ${count.value}.`)
})
onUnmounted(() => {
    stateSubscriber.unsubscribe()
})
function counter() {
    $store.dispatch({
        type: 'updateCurrentPage',
        payload: {
            count: count.value + 1
        }
    });
}
const addWidget = () => {

}
</script>