/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ITokenValidator,
  ITokenValidatorInterface,
} from "../ITokenValidator";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "baseTokens",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "amountToBorrow",
        type: "uint256",
      },
    ],
    name: "batchValidate",
    outputs: [
      {
        internalType: "enum ITokenValidator.Status[]",
        name: "",
        type: "uint8[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "baseTokens",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "amountToBorrow",
        type: "uint256",
      },
    ],
    name: "validate",
    outputs: [
      {
        internalType: "enum ITokenValidator.Status",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ITokenValidator__factory {
  static readonly abi = _abi;
  static createInterface(): ITokenValidatorInterface {
    return new utils.Interface(_abi) as ITokenValidatorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITokenValidator {
    return new Contract(address, _abi, signerOrProvider) as ITokenValidator;
  }
}
