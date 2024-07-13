import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  tables: {
    Counter: {
      schema: {
        value: "uint32",
      },
      key: [],
    },
    Function: {
      schema: {
        contractId: "uint32",
        id: "uint32",
        code: "bytes32"
      },
      key: ["contractId", "id"],
    },
    Slot: {
      schema: {
        contractId: "uint32",
        id: "uint32",
        value: "uint32"
      },
      key: ["contractId", "id"],
    },
    ContractCounter: {
      schema: {
        value: "uint32",
      },
      key: [],
    },
  },
});
