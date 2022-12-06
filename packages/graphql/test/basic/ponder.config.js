const { graphqlPlugin } = require("../../dist/src/index");

const ponderConfig = {
  plugins: [graphqlPlugin()],
  database: {
    kind: "sqlite",
    filename: ":memory:",
  },
  networks: [],
  sources: [],
};

module.exports = ponderConfig;
