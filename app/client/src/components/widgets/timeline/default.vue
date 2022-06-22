<template>
    <v-timeline v-if="state && props.uuid">
        <h3>{{ props.props.title || state.title }}</h3>
        <v-timeline-item dot-color="purple-lighten-2" fill-dot>
            <v-card>
                <v-card-title class="bg-red-lighten-1 justify-end">
                    <h2 class="mr-4 font-weight-light">
                        Title 4
                    </h2>
                    <v-icon size="large" icon="mdi-account-multiple-outline"></v-icon>
                </v-card-title>
                <v-card-text>
                    Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod
                    convenire principes at. Est et nobis iisque percipit.
                </v-card-text>
            </v-card>
        </v-timeline-item>

        <v-timeline-item dot-color="amber-lighten-1" fill-dot size="x-small">
            <v-card>
                <v-card-title class="bg-purple-lighten-2">
                    <v-icon size="large" class="mr-4" icon="mdi-magnify"></v-icon>
                    <h2 class="font-weight-light">
                        page specific props
                    </h2>
                </v-card-title>
                <v-card-text>
                    <pre> {{ props.props }}</pre>
                </v-card-text>
            </v-card>

        </v-timeline-item>

        <v-timeline-item dot-color="cyan-lighten-1" fill-dot>
            <v-card>
                <v-card-title class="bg-cyan-lighten-1">
                    <v-icon class="mr-4" size="large" icon="mdi-email-outline"></v-icon>
                    <h2 class="font-weight-light">
                        Title 3
                    </h2>
                </v-card-title>
                <v-card-text>
                    Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod
                    convenire principes at. Est et nobis iisque percipit.
                </v-card-text>
            </v-card>
        </v-timeline-item>

        <v-timeline-item dot-color="red-lighten-1" fill-dot size="x-small">
            <v-card>
                <v-card-title class="bg-amber-lighten-1 justify-end">
                    <h2 class="mr-4 font-weight-light">
                        widget state
                    </h2>
                    <v-icon size="large" icon="mdi-home-outline"></v-icon>
                </v-card-title>
                <v-card-text>
                    <pre>{{ state }}</pre>
                </v-card-text>
            </v-card>

        </v-timeline-item>

        <v-timeline-item dot-color="green-lighten-1" fill-dot>
            <v-card>
                <v-card-title class="bg-green-lighten-1">
                    <v-icon class="mr-4" size="large" icon="mdi-phone-in-talk"></v-icon>
                    <h2 class="font-weight-light">
                        Title 5
                    </h2>
                </v-card-title>
                <v-card-text>
                    Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod
                    convenire principes at. Est et nobis iisque percipit.
                </v-card-text>
            </v-card>
        </v-timeline-item>
    </v-timeline>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from 'vue'
const $store = inject('$store')
const state = ref({})
const stateSubscriber = $store.select(state => state.widgets[props.uuid]).subscribe(val => {
    state.value = val

})
const props = defineProps({
    props: {
        type: Object
    },
    uuid: {
        type: String
    }
})

onMounted(() => {

})
onUnmounted(() => {
    stateSubscriber.unsubscribe()
})
</script>