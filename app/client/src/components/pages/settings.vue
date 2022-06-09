<template>
    <v-container v-if="state">
        <h1>{{ $t(state.routeName) }} - {{ state.title }}</h1>
        <p>url params > {{ urlParams }} &lt;</p>
        <pre> {{ state }}</pre>
    </v-container>
</template>
<script setup>
import { inject } from 'vue'
const $store = inject('$store')

const state$ = $store.select(state => state.currentPage)
let state
state$.subscribe(val => state = val)
defineProps({
    urlParams: {
        type: String,
        default: 'moin'
    }
})

</script>