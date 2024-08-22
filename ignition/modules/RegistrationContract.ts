const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RegistrationContractModule", (m) => {
  const RegistrationContract = m.contract("RegistrationContract", [], {
    value : 10_000_000n
  });

  return { RegistrationContract };
});
