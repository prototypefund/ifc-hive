import comp from '@p/testboard.vue'
import App from '../../../App.vue'
import conf from '@p/conf.js'
import { initStore, prepareStore, wrapComponent, wrapFullPage } from '../../../../../.storybook/storeHelper.js'


// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Navigation/SideBar',
  // component: dashboardComp,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  // provide doesn't work hear !!!
  argTypes: {

  },
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { App, comp },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    initStore()
    prepareStore('testboard', args)
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: wrapFullPage('comp', 'App'),
});
const HeadlessTemplate = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { comp },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    initStore()
    prepareStore('testboard', args)
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: wrapComponent('comp', 'v-card'),
});
export const Headless = HeadlessTemplate.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Headless.args = conf.testboard;
export const Full = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Full.args = conf.testboard;
