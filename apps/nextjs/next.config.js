const withTM = require("next-transpile-modules")

function defineNextConfig(config) {
  return config;
}

module.exports = withTM(["@note-taking/trpc"])(
  defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
  })
);
