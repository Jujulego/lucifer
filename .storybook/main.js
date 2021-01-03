module.exports = {
  stories: [],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: {
          default: 'dark',
        },
        docs: {
          configureJSX: true,
        }
      }
    },
  ],
};
