import {
  waitTillCompleted,
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
  WalletV1,
  generateRandomPrivateKey,
  Faucet,
} from "@nilfoundation/niljs";

require("dotenv").config();

import { encodeFunctionData, decodeFunctionResult } from "viem";

const votingContract = require("../public/VotingContract.json");

const client = new PublicClient({
  transport: new HttpTransport({
    endpoint:
      "YOUR_RPC_URL",
  }),
  shardId: 1,
});

const viewResults = await client.call(
  {
    to: "VOTING_CONTRACT_ADDRESS",
    from: "VOTING_CONTRACT_ADDRESS",
    data: encodeFunctionData({
      abi: votingContract.abi,
      functionName: "viewResults",
      args: [1],
    }),
    gasLimit: 5000000n,
  },
  "latest"
);

console.log("View Results Without Formatting:", viewResults);

console.log(
  "View Results:",
  decodeFunctionResult({
    abi: votingContract.abi,
    functionName: "viewResults",
    data: viewResults,
  })
);
