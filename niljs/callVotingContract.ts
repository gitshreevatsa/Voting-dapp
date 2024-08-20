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

import { encodeFunctionData, hexToBigInt } from "viem";

const votingContract = require("../public/VotingContract.json");
const RegistrationContract = require("../public/RegistarationContract.json");

const client = new PublicClient({
  transport: new HttpTransport({
    endpoint:
      "YOUR_RPC_URL",
  }),
  shardId: 1,
});

const faucet = new Faucet(client);

const signer = new LocalECDSAKeySigner({
  privateKey:"REGISTERED_USER_PRIVATE_KEY",
});

const pubkey = await signer.getPublicKey();

const wallet = new WalletV1({
  pubkey: pubkey,
  client,
  signer,
  address: "REGISTERED_USER_ADDRESS"
});

const walletAddress = wallet.getAddressHex();
console.log("Wallet Address:", walletAddress);

// call voting contract to vote
const sendingVote = await wallet.sendMessage({
  to: "VOTING_CONTRACT_ADDRESS",
  value: 15_000_000n,
  data: encodeFunctionData({
    abi: votingContract.abi,
    functionName: "castVote",
    args: [1],
  }),
  feeCredit: 5_000_000n,
});

waitTillCompleted(client, 1, sendingVote);
console.log("Message Hash for Voting:", sendingVote);
