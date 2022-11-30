// TODO rework this mess
<template>
  <v-container v-if="(state && props.uuid && boardCount > 0)" class="ticketContainer"
    data-test-container="widgets/ticketboard/default" :style="{ width: boardCount * 500 + 'px' }"
    :data-test-container-uuid="props.uuid">
    <v-table class="ticketTable" v-if="tickets">
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
  </v-container>
</template>
<script setup>
import { inject, ref, shallowRef, onMounted, onUnmounted, computed } from "vue";
import ticketItem from "@t/items/ticketCard.vue"
const $store = inject("$store");
const state = ref({});
const data = ref({});
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
const splitIdentifier = function (identifier) {
  if (identifier.indexOf(';') > -1) {
    // multiple fields not implemented yet
  }
  const identifierKeyVal = identifier.split(':')
  const key = identifierKeyVal[0]
  const val = identifierKeyVal[1]
  return { key, val }
}
const filterData = function (id, exclude, data) {
  // id[0] contains the prop key and 1 the prop value
  let obj = false
  const tickets = {}
  // TODO There should be a better way to do this
  // TODO implement exclude
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      //data entry is now in obj
      obj = data[key]
      let dataItemExcluded = false
      if (exclude && exclude.length > 0) {
        exclude.forEach(identifier => {
          let id = splitIdentifier(identifier)
          if (obj.hasOwnProperty(id.key)) {
            // workaround for the boolean/string true/false values which always arrive here as string but might be boolean in data obj
            let isBoolean = ((id.val === 'true' || id.val === true) || (id.val === 'false' || id.val === false));
            if (isBoolean) {
              let isTrueSet = (id.val === 'true');
              let isFalseSet = (id.val === 'false');
              if ((isTrueSet && (obj[id.key] === true || obj[id.key] === 'true')) || (isFalseSet && (obj[id.key] === false || obj[id.key] === 'false'))) {
                dataItemExcluded = true
              }
            } else {
              if (typeof (obj[id.key]) === 'object') {
                if (obj[id.key].indexOf(id.val) > -1) {
                  dataItemExcluded = true
                }
              }
              if (typeof (obj[id.key]) === 'string') {
                if (obj[id.key] == id.val) {
                  dataItemExcluded = true
                }
              }
            }
          }
        })

      }
      if (!dataItemExcluded && obj.hasOwnProperty(id.key)) {
        // workaround for the boolean/string true/false values which always arrive here as string but might be boolean in data obj
        let isBoolean = ((id.val === 'true' || id.val === true) || (id.val === 'false' || id.val === false));
        if (isBoolean) {
          let isTrueSet = (id.val === 'true');
          let isFalseSet = (id.val === 'false');
          if ((isTrueSet && (obj[id.key] === true || obj[id.key] === 'true')) || (isFalseSet && (obj[id.key] === false || obj[id.key] === 'false'))) {
            tickets[key] = obj
          }
        } else {
          if (typeof (obj[id.key]) === 'object') {
            if (obj[id.key].indexOf(id.val) > -1) {
              tickets[key] = obj
            }
          }
          if (typeof (obj[id.key]) === 'string') {
            if (obj[id.key] == id.val) {
              tickets[key] = obj
            }
          }
        }
      }
    }
  }

  return tickets
}
const makeTickets = function (data) {
  const filter = state.value.filter
  if (filter && filter.identifier) {
    tickets.value.all = filterData(splitIdentifier(filter.identifier), filter.excluded, data)
    filter.generics.forEach(gen => {
      if (gen.title) {
        tickets.value.generics[gen.title] = {}
        tickets.value.generics[gen.title].tickets = filterData(splitIdentifier(gen.identifier), gen.excluded, tickets.value.all)
        tickets.value.generics[gen.title].title = gen.title

      }
    })
    filter.custom.forEach(cus => {
      const id = splitIdentifier(cus.identifier)
      if (data[id.val] && data[id.val].title) {
        tickets.value.custom[id.val] = {}
        tickets.value.custom[id.val].tickets = filterData(id, cus.excluded, tickets.value.all)
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
  max-width: 20000px !important;
}

.ticketTable {
  max-width: 20000px !important;
  width: 100% !important;
  padding-bottom: 50px
}

.ticketEndlessRow td {
  width: 300px !important;
  max-width: 500px !important;
}

.ticketEndlessRow td>.v-card {
  height: 100%;
}
</style>
