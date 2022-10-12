import App from './App.vue'
import { initStore } from '../.storybook/storeHelper.js'
import vueRouter from 'storybook-vue3-router'
import router from './router/index.js'
// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Integration/Default',
  // component: dashboardComp,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  // provide doesn't work hear !!!
  argTypes: {
  },
};


const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { App },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    initStore()
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: '<App />',
});

export const Full = Template.bind({});
Full.decorators = [
  /* this is the basic setup with no params passed to the decorator */
  vueRouter()
]