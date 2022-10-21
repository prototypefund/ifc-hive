import comp from '@p/avatar.vue'
import App from '../../App.vue'
import conf from '@p/conf.js'
import { dispatchStore, initStore, prepareStore, wrapComponent, wrapFullPage } from '../../../.storybook/storeHelper.js'

export default {
  title: 'Pages/Avatar',
  argTypes: {
  },
};


const HeadlessEditModeTemplate = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { comp },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    initStore()
    prepareStore('avatar', args)
    dispatchStore('avatar', 'ui/update', { editMode: true }) // Bessere Weg das zu machen ??
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`  v-bind="args" 
  template: wrapComponent('comp', 'v-card'),
});



export const HeadlessEditMode = HeadlessEditModeTemplate.bind({});
HeadlessEditMode.args = conf.avatar;




export const HeadlessEditModeBadMail = HeadlessEditModeTemplate.bind({});
HeadlessEditModeBadMail.args = conf.avatar;
