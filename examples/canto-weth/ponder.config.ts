import type { PonderConfig } from "@ponder/core";
import { graphqlPlugin } from "@ponder/graphql";

export const config: PonderConfig = {
  networks: [
    {
      name: "canto",
      chainId: 7700,
      rpcUrl: "https://canto.slingshot.finance",
    },
  ],
  contracts: [
    {
      name: "WETH",
      network: "canto",
      address: "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B",
      abi: "./abis/WETH.json",
      startBlock: 2670000,
      endBlock: 2680000,
    },
  ],
  plugins: [graphqlPlugin()],
};
