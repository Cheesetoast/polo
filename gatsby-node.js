exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: '@babel/preset-react',
    options: {
      runtime: 'automatic',
    },
  });
};
