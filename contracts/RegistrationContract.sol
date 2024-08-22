// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Nil.sol";

contract RegistrationContract is NilBase {
    mapping(address => bool) public voters;

    address[] public votersList;
    receive() external payable {}

    constructor() payable {}

    // Function to register a voter
    function registerVoter(address _voter) public {
        require(!voters[_voter], "Voter is already registered.");
        voters[_voter] = true;
        votersList.push(_voter);
    }

    // Function to verify if a voter is registered and hasn't voted yet
    function verifyVoter(address _voter, uint256 _candidateId) external payable {
        bool isValid =  voters[_voter];
        bytes memory data = abi.encodeWithSignature("handleCallback(bool,address,uint256)", isValid, _voter, _candidateId);
        Nil.asyncCall(msg.sender, address(this), address(this), 5_000_000, Nil.FORWARD_NONE, false, 10_000_000, data);
    }

    function getVoters() public view returns (address[] memory) {
        return votersList;
    }
}
