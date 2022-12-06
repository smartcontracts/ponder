import { Ponder, ResolvedPonderPlugin } from "@ponder/core";

import { graphqlPlugin } from "../src/index";

describe("graphqlPlugin", () => {
  let ponder: Ponder;
  let plugin: ResolvedPonderPlugin;

  // beforeEach(() => {
  //   plugin = graphqlPlugin();

  //   ponder = {
  //     // schema:
  //   };
  // });

  // afterEach(() => {
  //   plugin.teardown?.();
  // });

  // describe("setup", () => {
  //   it("creates a network using CachedProvider", async () => {
  //     // expect(ponder.networks.length).toBe(1);
  //     // const network = ponder.networks[0];
  //     // expect(network.name).toBe("mainnet");
  //     // expect(network.chainId).toBe(1);
  //     // expect(network.provider).toBeInstanceOf(CachedProvider);
  //     // expect(network.provider.network.chainId).toBe(1);
  //     // expect(network.provider.connection.url).toBe("rpc://test");
  //   });
  // });
});
