import dashboardComp from '@p/dashboard.vue'
import App from '../../App.vue'
import { inject } from "vue";
import conf from '@p/conf.js'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Pages/Dashboard',
  // component: dashboardComp,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  // provide doesn't work hear !!!
  argTypes: {
    urlParams: 'döner'
  },
};


const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { App, dashboardComp },
  //inject: ['state'],
  // The story's `args` need to be mapped into the template through the `setup()` method
  /* ??? inject() { return { "state": 'Hi grandmas' }; },*/
  setup() {
    const $store = inject("$store");

    $store.dispatch({
      type: "pages/add",
      routeName: 'app.dashboard',
      payload: args,
    });
    $store.dispatch({
      type: "currentPage/set",
      routeName: 'app.dashboard',
      payload: args,
    });
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: '<App is-in-test=1><dashboardComp/>></App>',
});

const HeadlessTemplate = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { dashboardComp },
  //inject: ['state'],
  // The story's `args` need to be mapped into the template through the `setup()` method
  /* ??? inject() { return { "state": 'Hi grandmas' }; },*/
  setup() {
    const $store = inject("$store");


    $store.dispatch({
      type: "pages/add",
      routeName: 'test.dashboard',
      payload: args,
    });
    $store.dispatch({
      type: "currentPage/set",
      routeName: 'test.dashboard',
      payload: args,
    });
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: '<dashboardComp v-bind="args.props"/>',
});

export const Headless = HeadlessTemplate.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Headless.args = conf.dashboard;
Headless.args.props = { urlParams: 'döner' }
export const Full = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Full.args = conf.dashboard;