
export default {
  title: 'TEST_Pages/Testboard',
};

const Template = (args) => ({
  setup() {
    return { args }
  },
  template: '<p data-test-id="p">TEST {{args}}</p>'
});


export const Full = Template.bind({}, { myArg: 'args' });
export const HeadlessTemplate = Template.bind({});
export const OthTherTTTemplate = Template.bind({});
export const OthTherTTTemplate22 = Template.bind({});
export const UxlllUUl2 = Template.bind({});
export const UxlllUUU2 = Template.bind({});
