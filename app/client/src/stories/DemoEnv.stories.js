
import getEnvVariable from '../lib/getEnvVariable'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Demo/EnvVariables',
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
 
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: '<p>Template args</p> <ol> <li v-for="(value, key, index) in args"> {{key}} : \"{{value}}\" </li><ol>',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
  API_BASE_URL:    getEnvVariable('VITE_API_BASE_URL'),
  NODE_ENV:   getEnvVariable('NODE_ENV')
};
