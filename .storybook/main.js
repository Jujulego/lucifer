module.exports = {
  stories: [],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-knobs',
      options: {
        timestamps: true
      }
    },
  ],
};
