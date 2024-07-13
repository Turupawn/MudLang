import { setup } from "./mud/setup";
import mudConfig from "contracts/mud.config";

const {
  components,
  systemCalls: { increment, deployContract, executeFunction },
  network,
} = await setup();

/*
// Components expose a stream that triggers when the component is updated.
components.Counter.update$.subscribe((update) => {
  const [nextValue, prevValue] = update.value;
  console.log("Counter updated", update, { nextValue, prevValue });
  document.getElementById("counter")!.innerHTML = String(nextValue?.value ?? "unset");
});
*/

// Attach the increment function to the html element with ID `incrementButton` (if it exists)
document.querySelector("#incrementButton")?.addEventListener("click", increment);

function convertStringToArray(inputString: string): number[] {
  // Ensure the input string is in the correct format for JSON parsing
  const formattedString = inputString
      .replace(/0x([0-9a-fA-F]+)/g, '"0x$1"') // Replace each hexadecimal value with a quoted string
      .replace(/'/g, '"'); // Replace any single quotes with double quotes

  // Parse the formatted string into an array
  const array = JSON.parse(formattedString);

  // Optionally, convert each hexadecimal string back to a number
  return array;
}

document.querySelector("#deployButton")?.addEventListener("click", () => {
  const codeDeploy = document.getElementById("codeDeploy").value;
  deployContract(convertStringToArray(codeDeploy));
});

document.querySelector("#executeButton")?.addEventListener("click", () => {
  const codeIdExecute = document.getElementById("contractIdExecute").value;
  const functionIdExecute = document.getElementById("functionIdExecute").value;
  const paramsExecute = document.getElementById("paramsExecute").value;
  executeFunction(codeIdExecute, functionIdExecute, convertStringToArray(paramsExecute));
});

// https://vitejs.dev/guide/env-and-mode.html
if (import.meta.env.DEV) {
  const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
  mountDevTools({
    config: mudConfig,
    publicClient: network.publicClient,
    walletClient: network.walletClient,
    latestBlock$: network.latestBlock$,
    storedBlockLogs$: network.storedBlockLogs$,
    worldAddress: network.worldContract.address,
    worldAbi: network.worldContract.abi,
    write$: network.write$,
    recsWorld: network.world,
  });
}
