<template>
    <v-menu v-model="toggled" :close-on-click="false" :close-on-content-click="false" location="end" v-if="state"
        transition="scale-transition" class="notificationDrawer">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" v-if="state.unreadCount > 0" icon="mdi-bell-circle"></v-btn>
            <v-btn v-bind="props" v-if="state.unreadCount == 0" icon="mdi-bell-circle-outline"></v-btn>
            <v-chip class="ma-2 unreadCount" size="x-small" :class="{ visible: state.unreadCount > 0 }" color="red"
                text-color="white">
                {{ state.unreadCount }}
            </v-chip>
        </template>

        <v-card left width="800">
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-title>Neu</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-list density="compact">
                            <v-list-item v-for="(entry, index) in state.items" :key="index"
                                :class="{ hovered: hover == index + 1 }" @mouseover="handleHover(index + 1)"
                                @mouseleave="handleHover(false)">
                                <v-list-item-title class="fullListItem" :class="entry.state">{{ entry }}
                                </v-list-item-title>
                                <template v-slot:append>
                                    <v-list-item-avatar end>
                                        <v-btn v-if="entry.state === 'read'" variant="text" color="grey lighten-1"
                                            @click="markUnRead(index)" icon="mdi-circle-small"></v-btn>
                                        <v-btn v-if="entry.state === 'unread'" variant="text" color="grey lighten-1"
                                            @click="markRead(index)" icon="mdi-circle-medium"></v-btn>
                                    </v-list-item-avatar>
                                </template>
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
import { inject, computed, ref, shallowRef, onMounted, onUnmounted } from 'vue'
const $store = inject('$store')
const state = ref({})
const panel = shallowRef(0)
const hover = shallowRef(0)
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
        type: 'notificationToggle',
        payload: {
            toggled: newValue
        }
    });
}
const handleHover = (itemId) => {
    if (!itemId) {
        hover.value = false
    } else {
        hover.value = itemId
    }
}
const markUnRead = (index) => {
    $store.dispatch({
        type: 'notificationMarkUnread',
        payload: {
            index
        }
    });
}
const markRead = (index) => {
    $store.dispatch({
        type: 'notificationMarkRead',
        payload: {
            index
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

.fullListItem.unread {
    color: red
}

.fullListItem {
    width: 100%
}

.hovered {
    background-color: red !important;
}

.hovered * {
    color: black !important
}

.unreadCount {
    visibility: hidden;
    position: absolute !important;
    right: -3px;
    top: 6px;
}

.unreadCount.visible {
    visibility: visible
}
</style>>
