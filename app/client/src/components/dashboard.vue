<template>
    <v-container v-if="state">
        <h1>{{ $t(state.routeName) }} - {{ state.title }}</h1>
        <p>url params > {{ urlParams }} &lt; click value {{ count }}</p>
        <v-btn @click="count++">addCount</v-btn>
        <v-btn @click="addWidget">addWidget</v-btn>
        <pre> {{ state }}</pre>

    </v-container>
</template>
<script setup>
import { inject, ref, onMounted } from 'vue'
const $featureStore = inject('$storeHelper').getFeatureStore('app-dashboard')
const state$ = $featureStore.select(state => state);
let state
const count = ref(0)
state$.subscribe(val => state = val)
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
    $featureStore.setState(state => ({
        widgets: [...state.widgets, ...state.config.widgets]
    }))
}
</script>