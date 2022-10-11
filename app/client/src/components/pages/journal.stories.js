import journalComp from '@p/journal.vue'
import { inject } from "vue";
import conf from '@p/conf.js'

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
  components: { journalComp },
  //inject: ['state'],
  // The story's `args` need to be mapped into the template through the `setup()` method
  /* ??? inject() { return { "state": 'Hi grandmas' }; },*/
  setup() {
    const $store = inject("$store");
    $store.dispatch({
      type: "pages/add",
      routeName: 'test.journal',
      payload: args,
    });
    $store.dispatch({
      type: "currentPage/set",
      routeName: 'test.journal',
      payload: args,
    });
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: '<journalComp/>',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = conf.journal;
