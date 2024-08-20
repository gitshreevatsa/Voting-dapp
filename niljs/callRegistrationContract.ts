// Generate client instance
// Generate wallet instance
// call create method by sendMessage method of wallet

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
  privateKey: generateRandomPrivateKey(),
});

const pubkey = await signer.getPublicKey();

const wallet = new WalletV1({
  pubkey: pubkey,
  client,
  signer,
  shardId: 1,
  salt: 100n,
});

const walletAddress = wallet.getAddressHex();

const fundingWallet = await faucet.withdrawToWithRetry(
  walletAddress,
  100_000_000n
);

waitTillCompleted(client, 1, fundingWallet);

await wallet.selfDeploy(true);

console.log("Private Key:", signer);
console.log("Wallet Address:", walletAddress);

const data = encodeFunctionData({
  abi: RegistrationContract.abi,
  functionName: "registerVoter",
  args: [walletAddress],
});

// call registration contract to register voter
const registerVoter = await wallet.sendMessage({
  to: "REGISTRATION_CONTRACT_ADDRESS",
  data: data,
  feeCredit: 5_000_000n,
});

waitTillCompleted(client, 1, registerVoter);
console.log("Message Hash for Registering Voter:", registerVoter);
