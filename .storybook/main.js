

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  "webpackFinal": async (config) => {
    // Exclude Gatsby from being processed
    config.resolve.alias = {
      ...config.resolve.alias,
      'gatsby': false,
      'gatsby-link': false,
      'gatsby-plugin-image': false
    };

    // Exclude Gatsby cache directory from processing
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules\/gatsby/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react']
        }
      }
    });

    return config;
  }
};
export default config;