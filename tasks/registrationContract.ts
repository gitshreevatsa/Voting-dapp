import { task } from "hardhat/config";

task("voters", "Get All Voters")
.addParam("contract", "The address of the contract")
.setAction(async (args, hre) => {
  const contract = await hre.ethers.getContractAt("RegistarationContract", args.contract);
  const voters = await contract.getVoters();
  console.log("Voters:", voters);
});