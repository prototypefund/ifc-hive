<template>
    <v-container v-if="currState">
        <h1>{{ $t(currState.routeName) }} - {{ currState.title }}</h1>
        <p>url params > {{ urlParams }} &lt; click value {{ count }}</p>
        <v-btn @click="count++">addCount</v-btn>
        <v-btn @click="addWidget">addWidget</v-btn>
        <pre> {{ currState }}</pre>

    </v-container>
</template>
<script setup>
import { inject, ref, onMounted } from 'vue'
const $store = inject('$store')
const store = $store.select(state => state['app-dashboard']);
let currState
const count = ref(0)
store.subscribe(val => currState = val)
defineProps({
    urlParams: {
        type: String,
        default: 'moin'
    }
})
onMounted(() => {
    console.log(`The initial count is ${count.value}.`)
})
const addWidget = () => {
    console.dir(store)
    debugger
    console.dir(currState)

}
</script>