// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHEVoteBallonDor
 * @dev A voting contract using Fully Homomorphic Encryption (FHE).
 *      Users can vote for Messi (1) or Ronaldo (2) while keeping votes encrypted.
 *      Both the user and the contract are allowed to decrypt the user's vote.
 */
contract FHEVoteBallonDor is SepoliaConfig {
    euint32 private _messiVotes;
    euint32 private _ronaldoVotes;
    mapping(address => euint32) private _userVotes;

    /**
     * @notice Cast or update a vote.
     * @param choiceEncrypted The encrypted vote (1 for Messi, 2 for Ronaldo).
     * @param proof Zero-knowledge proof for the encrypted input.
     */
    function vote(externalEuint32 choiceEncrypted, bytes calldata proof) external {
        euint32 choice = FHE.fromExternal(choiceEncrypted, proof);
        euint32 prevVote = _userVotes[msg.sender];

        {
            euint32 prevOne = FHE.asEuint32(1);
            euint32 prevTwo = FHE.asEuint32(2);

            euint32 wasMessi = FHE.select(FHE.eq(prevVote, prevOne), FHE.asEuint32(1), FHE.asEuint32(0));
            euint32 wasRonaldo = FHE.select(FHE.eq(prevVote, prevTwo), FHE.asEuint32(1), FHE.asEuint32(0));

            _messiVotes = FHE.sub(_messiVotes, wasMessi);
            _ronaldoVotes = FHE.sub(_ronaldoVotes, wasRonaldo);
        }

        _userVotes[msg.sender] = choice;

        FHE.allow(_userVotes[msg.sender], msg.sender);
        FHE.allowThis(_userVotes[msg.sender]);

        {
            euint32 one = FHE.asEuint32(1);
            euint32 two = FHE.asEuint32(2);

            euint32 isMessi = FHE.select(FHE.eq(choice, one), FHE.asEuint32(1), FHE.asEuint32(0));
            euint32 isRonaldo = FHE.select(FHE.eq(choice, two), FHE.asEuint32(1), FHE.asEuint32(0));

            _messiVotes = FHE.add(_messiVotes, isMessi);
            _ronaldoVotes = FHE.add(_ronaldoVotes, isRonaldo);
        }

        FHE.allowThis(_messiVotes);
        FHE.allowThis(_ronaldoVotes);
        FHE.allow(_messiVotes, msg.sender);
        FHE.allow(_ronaldoVotes, msg.sender);
    }

    /**
     * @notice Get the encrypted total votes for Messi.
     * @return The encrypted number of votes for Messi.
     */
    function getMessiVotes() external view returns (euint32) {
        return _messiVotes;
    }

    /**
     * @notice Get the encrypted total votes for Ronaldo.
     * @return The encrypted number of votes for Ronaldo.
     */
    function getRonaldoVotes() external view returns (euint32) {
        return _ronaldoVotes;
    }

    /**
     * @notice Get the encrypted vote of the caller.
     * @return The encrypted vote of the caller.
     */
    function getMyVote() external view returns (euint32) {
        return _userVotes[msg.sender];
    }

    /**
     * @notice Get the encrypted vote of a specific user.
     * @dev Both the contract and the respective user are allowed to decrypt.
     * @param user The address of the user.
     * @return The encrypted vote of the specified user.
     */
    function getUserVote(address user) external view returns (euint32) {
        return _userVotes[user];
    }
}


