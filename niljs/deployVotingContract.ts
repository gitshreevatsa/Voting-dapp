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

const client = new PublicClient({
  transport: new HttpTransport({
    endpoint:
      "YOUR_RPC_URL",
  }),
  shardId: 1,
});

const contract = require("../public/VotingContract.json");

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
  salt: 110n,
});

const walletAddress = wallet.getAddressHex();

const fundingWallet = await faucet.withdrawToWithRetry(
  walletAddress,
  100_000_000n
);

waitTillCompleted(client, 1, fundingWallet);

await wallet.selfDeploy(true);

console.log("Wallet Address:",walletAddress);

const candidateIds = [0,1]


const deployVotingContract = await wallet.deployContract({
  shardId: 2,
  feeCredit: 5_000_000n,
  bytecode: contract.bytecode,
  salt: 112n,
  abi: contract.abi,
  args: ["REGISTRATION_CONTRACT_ADDRESS",candidateIds],
});

waitTillCompleted(client, 1, deployVotingContract.hash);
console.log("Message Hash", deployVotingContract.hash);
console.log("Contract deployed at address", deployVotingContract.address);