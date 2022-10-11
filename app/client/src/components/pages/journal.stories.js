import journalComp from '@p/journal.vue'
import App from '../../App.vue'
import { inject } from "vue";
import conf from '@p/conf.js'
import {initStore, prepareStore} from '../../../.storybook/storeHelper.js'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Pages/Journal',
  // component: dashboardComp,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  // provide doesn't work hear !!!
  argTypes: {

  },
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { App, journalComp },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    initStore()
    prepareStore('journal', args)
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: '<App is-in-test=1><journalComp/>></App>',
});
const HeadlessTemplate = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { journalComp },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    initStore()
    prepareStore('journal', args)
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: '<journalComp/>',
});
export const Headless = HeadlessTemplate.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Headless.args = conf.journal;
export const Full = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Full.args = conf.journal;