import store from '../store/index.js'
import i18n from '../setup/i18n.js'
import vuetify from '../setup/vuetify.js'


// import { inject, ref, onMounted, onUnmounted } from "vue";
/*
const $store = inject("$store");

const Vue = require('vue');
const MyStore = require('mini-rx-store');
const store = require('../src/store');

Vue.use(MyStore);
Vue.prototype.$store = store;
*/

import dashboardComp from '@p/dashboard.vue'

/*
import dashboardComp from '@p/settings.vue'
import { inject, ref, onMounted, onUnmounted, provide, createApp, reactive } from "vue";

src/components/pages/dashboard.vue:64:65
*/


// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Demo/dashboardComp',
  // component: dashboardComp,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  // provide doesn't work hear !!!
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: {},
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};


const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { dashboardComp },
  //inject: ['state'],
  // The story's `args` need to be mapped into the template through the `setup()` method
  provide() {
    return {
      $store: store
    };
  },
  use() {
    i18n
  },
  /* ??? inject() { return { "state": 'Hi grandmas' }; },*/
  setup() {

    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: '<dashboardComp/>', 
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
  primary: true,
  label: 'Button',
};
