// TODO rework this mess
<template>
  <v-container v-if="(state && props.uuid && boardCount > 0)" fluid pa-0
    data-test-container="widgets/ticketboard/default" :data-test-container-uuid="props.uuid">
    <div class="ticketContainer">
      <v-table class="ticketTable" v-if="tickets" :style="{ width: boardCount * 380 + 'px' }">
        <tbody>
          <tr>
            <td width="300" v-if="tickets.generics.open">
              <ticket-item :column="tickets.generics.open" :data="data" />
            </td>
            <td width="300" v-for="(column, key) in tickets.custom" :key="key">
              <ticket-item :column="column" :data="data" />
            </td>
            <td width="300" v-if="tickets.generics.closed">
              <ticket-item :column="tickets.generics.closed" :data="data" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <pre>
    {{ tickets }}
    </pre>
  </v-container>
</template>
<script setup>
import { inject, ref, shallowRef, onMounted, onUnmounted, computed } from "vue";
import ticketItem from "@t/items/ticketCard.vue"
import { splitIdentifier, filterData } from "./helper.js"
const $store = inject("$store");
const state = ref({});
const data = ref({});
const viewPortHeight = shallowRef(0)
const boardCount = shallowRef({});
const tickets = ref({
  all: {},
  generics: {},
  custom: {}
})
const props = defineProps({
  props: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  uuid: {
    type: String,
    required: true,
  },
});

const makeTickets = function (data) {
  const filter = state.value.filter
  if (filter) {
    //tickets.value.all = filterData(splitIdentifier(filter.identifier), filter.excluded, data)
    filter.generics.forEach(gen => {
      if (gen.title) {
        tickets.value.generics[gen.title] = {}
        tickets.value.generics[gen.title].tickets = filterData(splitIdentifier(gen.identifier), gen.excluded, data)
        tickets.value.generics[gen.title].title = gen.title

      }
    })
    filter.custom.forEach(cus => {
      const id = splitIdentifier(cus.identifier)
      if (data[id.val] && data[id.val].title) {
        tickets.value.custom[id.val] = {}
        tickets.value.custom[id.val].tickets = filterData(id, cus.excluded, data)
        tickets.value.custom[id.val].title = data[id.val].title
        tickets.value.custom[id.val].color = data[id.val].color
      }
    })
  }
}

const dataSubscriber$ = $store
  .select((state) => state.data)
  .subscribe((val) => {
    data.value = val
    makeTickets(val)
  });
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
    makeTickets(data.value)
  });

const handleGenericsExclude = function () {
  if (state.value.filter) {
    const newState = JSON.parse(JSON.stringify(state.value))
    const customIdentifiers = []
    if (newState.filter.custom && newState.filter.custom.length > 0) {
      newState.filter.custom.forEach(ticketCol => {
        customIdentifiers.push(ticketCol.identifier)
      })
    }
    if (newState.filter.generics && newState.filter.generics.length > 0) {
      newState.filter.generics.forEach(genericTicketCol => {
        if (!genericTicketCol.excluded) {
          genericTicketCol.excluded = []
        }
        customIdentifiers.forEach(identifier => {
          if (genericTicketCol.excluded.indexOf(identifier) === -1) {
            genericTicketCol.excluded.push(identifier)
          }
        })
      })
    }
    boardCount.value = newState.filter.generics.length + newState.filter.custom.length
    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        filter: {
          generics: newState.filter.generics
        }
      },
    });
  }
}

onMounted(() => {
  handleGenericsExclude()
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  dataSubscriber$.unsubscribe();
});
</script>
<style lang="css" scoped>
.ticketContainer {
  overflow-x: auto;
}

.ticketTable {
  max-width: 20000px !important;
}
</style>
