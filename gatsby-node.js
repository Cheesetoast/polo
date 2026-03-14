const path = require('path');

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: '@babel/preset-react',
    options: {
      runtime: 'automatic',
    },
  });
};

// Force @dnd-kit to use CJS builds so Babel/SSR doesn't fail on their ESM
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  const isProd = stage === 'build-javascript' || stage === 'build-html';
  const dndCjs = (pkg, file) =>
    path.resolve(__dirname, `node_modules/${pkg}/dist/${file}.cjs.${isProd ? 'production.min' : 'development'}.js`);

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@dnd-kit/accessibility': dndCjs('@dnd-kit/accessibility', 'accessibility'),
        '@dnd-kit/core': dndCjs('@dnd-kit/core', 'core'),
        '@dnd-kit/utilities': dndCjs('@dnd-kit/utilities', 'utilities'),
      },
    },
  });
};
