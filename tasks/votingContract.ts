import {task} from "hardhat/config";

task("results", "View Results")
.addParam("contract", "The address of the contract")
.addParam("candidateid", "The candidate id")
.setAction(async (args, hre) => {
    const contract = await hre.ethers.getContractAt("VotingContract", args.contract);
    const results = await contract.viewResults(args.candidateid);
    console.log("Results:", results);
    }
);

task("getValidCandidate", "Get Valid Candidate")
.addParam("contract", "The address of the contract")
.addParam("candidateid", "The candidate id")
.setAction(async (args, hre) => {
    const contract = await hre.ethers.getContractAt("VotingContract", args.contract);
    const isValid = await contract.getValidCandidate(args.candidateid);
    console.log("Is Valid Candidate:", isValid);
    }
);

task("getVoterStatus", "Get Voter Status")
.addParam("contract", "The address of the contract")
.addParam("voter", "The voter address")
.setAction(async (args, hre) => {
    const contract = await hre.ethers.getContractAt("VotingContract", args.contract);
    const status = await contract.getVoterStatus(args.voter);
    console.log("Voter Status:", status);
    }
);

task("castVote", "Cast Vote")
.addParam("contract", "The address of the contract")
.addParam("candidateid", "The candidate id")
.setAction(async (args, hre) => {
    const contract = await hre.ethers.getContractAt("VotingContract", args.contract);
    const tx = await contract.castVote(args.candidateid);
    await tx.wait();
    console.log("Vote Casted Successfully", tx.hash);
    }
);