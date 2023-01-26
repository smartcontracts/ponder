import { ponder } from "../generated";

ponder.on("WETH:Transfer", async ({ event, context }) => {
  console.log(event.block.number);
});
