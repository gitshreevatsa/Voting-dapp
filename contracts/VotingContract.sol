// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Nil.sol";

contract VotingContract is NilBase {
    address public voterRegistrationAddress;
    mapping(uint256 => uint256) public votes;
    mapping(uint256 => bool) public validCandidates; // Mapping to store valid candidate IDs
    mapping(address => bool) public voters; // Mapping to store valid voters

    receive() external payable {}

    constructor(address _voterRegistrationAddress, uint256[] memory _candidateIds) {
        voterRegistrationAddress = _voterRegistrationAddress;

        // Initialize votes and valid candidates
        for (uint256 i = 0; i < _candidateIds.length; i++) {
            uint256 candidateId = _candidateIds[i];
            votes[candidateId] = 0;
            validCandidates[candidateId] = true;
        }
    }

    // Function to cast a vote for a candidate
    function castVote(uint256 _candidateId) external payable {

        // Prepare the data for async call to verify voter
        bytes memory data = abi.encodeWithSignature(
            "verifyVoter(address,uint256)",
            msg.sender, // wallet address calling
            _candidateId
        );

        // Make async call to verify voter
        Nil.asyncCall(voterRegistrationAddress, address(this), address(this), 5_000_000, Nil.FORWARD_NONE, false, 10_000_000, data);
    }

    // Callback function to handle the response from voter verification
    function handleCallback(bool isValid, address voter, uint256 candidateId) external payable {
        // Ensure the callback is valid
        require(isValid, "Voter is not registered or has already voted.");

        // Increment the vote count for the candidate
        votes[candidateId]++;
        voters[voter] = true;
    }

    // Function to view the result for a specific candidate
    function viewResults(uint256 _candidateId) external view returns (uint256) {
        // Ensure the candidate ID is valid
        require(validCandidates[_candidateId], "Invalid candidate ID.");

        // Return the vote count for the candidate
        return votes[_candidateId];
    }

    function getValidCandidate(uint256 _candidateId) public view returns (bool) {
        return validCandidates[_candidateId];
    }

    function getVoterStatus(address voter) public view returns (bool) {
        return voters[voter];
    }
}
