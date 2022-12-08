import { Ponder, ResolvedPonderPlugin } from "@ponder/core";

import type { GraphqlServer } from "@/server";

type GraphqlPlugin = ResolvedPonderPlugin & {
  server: GraphqlServer | undefined;
};

describe("graphqlPlugin", () => {
  let ponder: Ponder;
  let plugin: GraphqlPlugin;

  beforeEach(() => {
    ponder = new Ponder({
      rootDir: "./test/basic",
      configFile: "ponder.config.js",
      silent: false,
    });

    plugin = ponder.plugins.find((p) => p.name === "graphql") as GraphqlPlugin;
    expect(plugin).toBeDefined();
  });

  afterEach(() => {
    ponder.kill();
  });

  describe("constructor", () => {
    it("registers the graphql plugin", async () => {
      expect(ponder.plugins.length).toBe(1);

      await plugin.setup?.(ponder);

      expect(plugin.server).toBeDefined;
    });
  });
});
