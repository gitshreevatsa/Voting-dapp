const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// biome-ignore lint: type is not exported
module.exports = buildModule("VotingContractModule", (m: any) => {

    const votingContract = m.contract("VotingContract", []);

  return { votingContract };
});
