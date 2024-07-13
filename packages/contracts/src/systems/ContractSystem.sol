// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Function, Slot, ContractCounter } from "../codegen/index.sol";

contract ContractSystem is System {
  function deployContract(bytes32[] memory functions) public returns (uint32) {
    uint32 contractCounter = ContractCounter.get();
    contractCounter+=1;
    ContractCounter.set(contractCounter);
    for(uint32 i=0; i<functions.length; i++)
    {
        Function.set(contractCounter, i, functions[i]);
    }
    return contractCounter;
  }

  function executeFunction(uint32 contractId, uint32 functionId, bytes32[] memory params) public returns (bool) {
    bytes32 code = Function.get(contractId, functionId);
    uint32 i;

    bytes32[] memory stack = new bytes32[](100);
    uint32 top = 0;
    while(code[i]!=0x00)
    {
        if(code[i] == 0x10) { // push 0
            top+=1;
            stack[top] = bytes32(uint(0x00));
        }
        if(code[i] == 0x11) { // push 1
            top+=1;
            stack[top] = bytes32(uint(0x01));
        }
        if(code[i] == 0x12) { // push 2
            top+=1;
            stack[top] = bytes32(uint(0x02));
        }
        if(code[i] == 0x13) { // push 3
            top+=1;
            stack[top] = bytes32(uint(0x03));
        }
        if(code[i] == 0x14) { // push 4
            top+=1;
            stack[top] = bytes32(uint(0x04));
        }
        if(code[i] == 0x20) { // ParamRead(ParamPos) returns ParamValue
            stack[top] = params[uint32(uint(stack[top]))];
        }
        if(code[i] == 0x21) { // SlotRead(SlotPos) returns Slot Value
            stack[top] = bytes32(uint(Slot.get(contractId, uint32(uint(stack[top])))));
        }
        if(code[i] == 0x22) { // Hash(A, B) returns HashedVaule
            stack[top-1] = keccak256(abi.encodePacked(uint32(uint(stack[top])), uint32(uint(stack[top-1]))));
            top-=1;
        }
        if(code[i] == 0x23) { // Hash(SlotPos, NewValue)
            Slot.set(contractId, uint32(uint(stack[top])), uint32(uint(stack[top-1])));
            top-=2;
        }
        i+=1;
    }

    return true;
  }
}