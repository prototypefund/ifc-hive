<template>
  <v-container
    class="bg-surface-variant"
    data-test-id="column_3_cards_darkContainer"
    v-if="contents"
  >
    <v-row no-gutters>
      <v-col :class="getSlotClass(contents['0'])">
        <v-card
          class="pa-2 ma-2"
          v-if="contents['0']"
          data-test-id="column_3_cards_darkSlot_1"
        >
          <component0
            v-if="contents['0'].widget"
            :uuid="contents['0'].widget.uuid"
            :props="contents['0'].widget.props || {}"
          />
        </v-card>
      </v-col>

      <v-col :class="getSlotClass(contents['1'])">
        <v-card
          class="pa-2 ma-2"
          v-if="contents['1']"
          data-test-id="column_3_cards_darkSlot_2"
        >
          <component1
            v-if="contents['1'].widget"
            :uuid="contents['1'].widget.uuid"
            :props="contents['1'].widget.props || {}"
          />
        </v-card>
      </v-col>

      <v-col :class="getSlotClass(contents['2'])">
        <v-card
          class="pa-2 ma-2"
          v-if="contents['2']"
          data-test-id="column_3_cards_darkSlot_3"
        >
          <component2
            v-if="contents['2'].widget"
            :uuid="contents['2'].widget.uuid"
            :props="contents['2'].widget.props || {}"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { onMounted, defineAsyncComponent, shallowRef } from "vue";
import widgetLoader from "@lib/widgetLoader";
//TODO find a generic way to add yet unknown components to vue component instance
const component0 = shallowRef({});
const component1 = shallowRef({});
const component2 = shallowRef({});
const props = defineProps({
  contents: {
    type: Object,
    required: true,
  },
});
const loadWidget = (name, face) =>
  defineAsyncComponent(() => {
    return widgetLoader(name, face);
  });
onMounted(() => {
  if (props.contents) {
    props.contents.forEach((element, index) => {
      if (!element.widget) return;

      switch (index) {
        //TODO find a generic way to add yet unknown components to vue component instance
        case 0:
          component0.value = loadWidget(element.widget.name, element.widget.face);
          break;
        case 1:
          component1.value = loadWidget(element.widget.name, element.widget.face);
          break;
        case 2:
          component2.value = loadWidget(element.widget.name, element.widget.face);
          break;
      }
    });
  } else {
    debugger;
  }
});

const getSlotClass = (slot) => {
  if (!slot) return "";
  return slot && slot.column ? slot.column : "";
};
</script>
