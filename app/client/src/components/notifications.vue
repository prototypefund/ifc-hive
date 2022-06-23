<template>
    <v-menu v-model="toggled" :close-on-click="false" :close-on-content-click="false" location="end" v-if="state"
        transition="scale-transition" class="notificationDrawer">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" v-if="state.unreadCount > 0" icon="mdi-bell-badge-outline"></v-btn>
            <v-btn v-bind="props" v-if="state.unreadCount == 0" icon="mdi-bell-outline"></v-btn>
        </template>
        <v-card left width="800">
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-title>Neu</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-list>
                            <v-list-item v-for="(entry, index) in state.items.slice().reverse()" :key="index">
                                {{ entry }}
                            </v-list-item>
                        </v-list>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel v-if="state.history.length > 0">
                    <v-expansion-panel-title>Alle</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-list>
                            <v-list-item v-for="(entry, index) in state.history.slice().reverse()" :key="index">
                                {{ entry }}
                            </v-list-item>
                        </v-list>
                    </v-expansion-panel-text>
                </v-expansion-panel>

            </v-expansion-panels>
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text @click="menu = false">
                    Cancel
                </v-btn>
                <v-btn color="primary" text @click="menu = false">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>

</template>
<script setup>
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'
const $store = inject('$store')
const state = ref({})
const panel = ref(0)
const toggled = computed({
    // getter
    get() {
        return state.value.toggled
    },
    // setter
    set(newValue) {
        toggleNotifier(newValue)
    }
})
const stateSubscriber = $store.select(state => state.notifications).subscribe(val => {
    state.value = val
})
const toggleNotifier = (newValue) => {
    panel.value = 0
    $store.dispatch({
        type: 'toggleNotification',
        payload: {
            toggled: newValue
        }
    });
}
onMounted(() => {
})
onUnmounted(() => {
    stateSubscriber.unsubscribe()
})
</script>
<style lang="css">
.notificationDrawer>.v-overlay__content {
    right: 0px !important;
    left: auto !important
}
</style>>
