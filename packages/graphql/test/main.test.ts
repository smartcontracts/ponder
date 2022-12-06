import { Ponder, ResolvedPonderPlugin } from "@ponder/core";

describe("graphqlPlugin", () => {
  let ponder: Ponder;
  let plugin: ResolvedPonderPlugin;

  beforeEach(() => {
    ponder = new Ponder({
      rootDir: "./test/basic",
      configFile: "ponder.config.js",
      silent: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    plugin = ponder.plugins.find((p) => p.name === "graphql")!;
    expect(plugin).toBeDefined();
  });

  afterEach(() => {
    ponder.kill();
  });

  describe("constructor", () => {
    it("registers the graphql plugin", async () => {
      expect(ponder.plugins.length).toBe(1);
    });
  });
});
