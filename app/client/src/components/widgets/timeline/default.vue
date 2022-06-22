<template>
    {{ props }}
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from 'vue'
const $store = inject('$store')
defineProps({
    props: {
        type: Object
    }
})

onMounted(() => {
    debugger
})
</script>