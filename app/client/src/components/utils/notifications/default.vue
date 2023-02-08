//TODO wait until vuetify fixes the v-badge
<template>
  <v-menu v-model="toggled" :close-on-click="false" :close-on-content-click="false" location="bottom" v-if="state"
    transition="scroll-y-transition" class="notificationDrawer">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" class="text-none" stacked>
        <template v-if="state.unreadCount > 0">
          <v-badge :content="state.unreadCount" :color="state.unreadCount > 0 ? 'error' : 'black'">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </template>
        <template v-else><v-icon>mdi-bell-outline</v-icon></template>
      </v-btn>
    </template>

    <v-card left class="notificationContent">
      <v-expansion-panels v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-title>Neu</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list density="compact">
              <v-list-item v-for="(entry, index) in state.items" :key="index" :class="{ hovered: hover == index + 1 }"
                @mouseover="handleHover(index + 1)" @mouseleave="handleHover(false)">
                <template v-slot:prepend>
                  <v-icon v-if="entry.event === 'updateItem'" icon="mdi-file-edit"></v-icon>
                  <v-icon v-if="entry.event === 'newItem'" icon="mdi-folder-plus"></v-icon>
                  <v-icon v-if="entry.event === 'push'" icon="mdi-folder-information"></v-icon>
                </template>
                <v-list-item-title class="fullListItem" :class="entry.state">{{
                  entry.message
                }}</v-list-item-title>
                <template v-slot:append>
                  <v-btn v-if="entry.state === 'read'" variant="text" color="grey lighten-1" @click="markUnRead(index)"
                    icon="mdi-circle-small"></v-btn>
                  <v-btn v-if="entry.state === 'unread'" variant="text" color="grey lighten-1" @click="markRead(index)"
                    icon="mdi-circle-medium"></v-btn>
                  <v-btn v-if="entry.state === 'seen'" variant="text" color="grey lighten-1" @click="markRead(index)"
                    icon="mdi-circle-medium"></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="toggled = false"> {{ $t("cancel") }} </v-btn>
        <v-btn color="primary" text @click="clearAll()"> {{ $t("clear") }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup>
import { inject, computed, ref, shallowRef, onMounted, onUnmounted } from "vue";
const $store = inject("$store");
const state = ref({});
const panel = shallowRef(0);
const hover = shallowRef(0);
const toggled = computed({
  // getter
  get() {
    return state.value.toggled;
  },
  // setter
  set(newValue) {
    toggleNotifier(newValue);
  },
});
const stateSubscriber$ = $store
  .select((state) => state.notifications)
  .subscribe((val) => {
    state.value = val;
  });
const toggleNotifier = (newValue) => {
  panel.value = 0;
  $store.dispatch({
    type: "notifications/toggle",
    payload: {
      toggled: newValue,
    },
  });
};
const handleHover = (itemId) => {
  if (!itemId) {
    hover.value = false;
  } else {
    hover.value = itemId;
  }
};
const clearAll = () => {
  $store.dispatch({
    type: "notifications/clear",
  });
  toggleNotifier(false);
};
const markUnRead = (index) => {
  $store.dispatch({
    type: "notifications/markUnread",
    payload: {
      index,
    },
  });
};
const markRead = (index) => {
  $store.dispatch({
    type: "notifications/markAsRead",
    payload: {
      index,
    },
  });
};
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
<style lang="css">
.fullListItem.unread {
  text-decoration: underline;
}

.fullListItem.seen {
  font-style: italic;
}

.fullListItem {
  -webkit-user-select: none;
  /* Safari */
  -ms-user-select: none;
  /* IE 10 and IE 11 */
  user-select: none;
  /* Standard syntax */
  width: 100%;
}

.hovered {
  background-color: rgb(92, 91, 91) !important;
}

.hovered * {
  color: black !important;
}

.unreadCount {
  visibility: hidden;
  position: absolute !important;
  right: -3px;
  top: 6px;
}

.unreadCount.visible {
  visibility: visible;
}

.notificationContent {
  width: 500px;
}
</style>
