/*

import store from '../store/index.js'


import { inject, ref, onMounted, onUnmounted } from "vue";
import { provide } from 'vue';
provide('$store', store)
*/

import store from '../store/index.js'

store.dispatch({
  type: 'pages/add',
  routeName: 'toname',
  payload: 'conftestboard'
});


// ../src/store/index.js
// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Demo/Imports',
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: {},
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  setup() {
    return { args };
  },
  template: '<p>Done Args: {{args}}</p>',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
 // store:store,
  ig: ''+inject("$store"),
  dummy:"dummy"
};
// /home/tower/vue/ifc-hive/app/client/src/components/utils/navigation/sidebar.vue