<template>
    <v-container v-if="state">
        <h1>{{ $t(state.routeName) }} - {{ state.title }}</h1>
        <p>url params > {{ urlParams }} &lt; click value {{ state.count }}</p>
        <v-btn @click="counter">addCount</v-btn>
        <v-btn @click="addWidget">addWidget</v-btn>
        <v-row>
            <v-col cols="6">
                <h2>page state</h2>
                <v-card>
                    <pre>{{ state }}</pre>
                </v-card>
            </v-col>
            <v-col v-bind:cols="6">
                <h2>widget state</h2>
                <slot v-if="state.slots && state.slots.default">
                    <AsyncComp :props="state.slots.default"></AsyncComp>
                </slot>
            </v-col>

        </v-row>


    </v-container>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
const $store = inject('$store')
const state = ref({})
const stateSubscriber = $store.select(state => state.currentPage).subscribe(val => {
    state.value = val
})
const slotSubscriber = $store.select(state => state.currentPage.slots).subscribe(val => {

})
const AsyncComp = defineAsyncComponent((props) => {
    //TODO either find a proper way to get generic async components or hook in a widget loader component
    return import('@w/timeline/default.vue')
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
    slotSubscriber.unsubscribe()
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