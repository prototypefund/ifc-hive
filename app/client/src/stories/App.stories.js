import store from '../store/index.js'

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
'@': path.resolve(__dirname, './src/components'),
'@w': path.resolve(__dirname, './src/components/widgets'),
'@p': path.resolve(__dirname, './src/components/pages'),
'@t': path.resolve(__dirname, './src/components/templates'),
'@u': path.resolve(__dirname, './src/components/utils'),
'@lib': path.resolve(__dirname, './src/lib'),
},*/


// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Demo/dashboardComp',
  component: dashboardComp,
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
  components: { dashboardComp },
  // The story's `args` need to be mapped into the template through the `setup()` method
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
