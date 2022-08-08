<template>
  <v-container
    v-if="contents"
    data-test-id="column_3_cardsContainer"
    fluid
    class="pa-0 ma-0"
  >
    <v-row no-gutters>
      <v-col :class="getSlotClass(contents[0])">
        <v-card class="pa-2 ma-2" v-if="contents[0]" data-test-id="slot" flat>
          <component0
            v-if="contents[0].widget"
            :uuid="contents[0].widget.uuid"
            :props="contents[0].widget.props || {}"
          />
        </v-card>
      </v-col>

      <v-col :class="getSlotClass(contents[1])">
        <v-card class="pa-2 ma-2" v-if="contents[1]" data-test-id="slot" flat>
          <component1
            v-if="contents[1].widget"
            :uuid="contents[1].widget.uuid"
            :props="contents[1].widget.props || {}"
          />
        </v-card>
      </v-col>

      <v-col :class="getSlotClass(contents[2])">
        <v-card class="pa-2 ma-2" v-if="contents[2]" data-test-id="slot" flat>
          <component2
            v-if="contents[2].widget"
            :uuid="contents[2].widget.uuid"
            :props="contents[2].widget.props || {}"
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
//TODO maybe get rid of the props here or use url params as props are merged in widget state
const component0 = shallowRef({});
const component1 = shallowRef({});
const component2 = shallowRef({});
const props = defineProps({
  contents: {
    type: Array,
    required: true,
  },
});
const loadWidget = (name) =>
  defineAsyncComponent(() => {
    return widgetLoader(name);
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
