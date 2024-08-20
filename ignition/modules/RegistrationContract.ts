const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// biome-ignore lint: type is not exported
module.exports = buildModule("RegistarationContractModule", (m: any) => {
  const RegistrationContract = m.contract("RegistarationContract");

  return { RegistrationContract };
});