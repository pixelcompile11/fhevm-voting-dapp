import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { FHEVoteBallonDor, FHEVoteBallonDor__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

describe("FHEVoteBallonDor - Fixed Permissions", function () {
  let signers: Signers;
  let fheVoteContract: FHEVoteBallonDor;
  let fheVoteContractAddress: string;

  before(async function () {
    const ethSigners = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This test suite cannot run on Sepolia Testnet");
      this.skip();
    }
    const factory = (await ethers.getContractFactory("FHEVoteBallonDor")) as FHEVoteBallonDor__factory;
    fheVoteContract = (await factory.deploy()) as FHEVoteBallonDor;
    fheVoteContractAddress = await fheVoteContract.getAddress();
  });

  it("initial votes should be uninitialized", async function () {
    const encryptedMessi = await fheVoteContract.getMessiVotes();
    const encryptedRonaldo = await fheVoteContract.getRonaldoVotes();

    expect(encryptedMessi).to.eq(ethers.ZeroHash);
    expect(encryptedRonaldo).to.eq(ethers.ZeroHash);
  });

  it("Alice votes Messi and vote is correct", async function () {
    const choiceMessi = 1;
    const signerAlice = signers.alice;

    const encryptedInput = await fhevm
      .createEncryptedInput(fheVoteContractAddress, signerAlice.address)
      .add32(choiceMessi)
      .encrypt();

    await fheVoteContract.connect(signerAlice).vote(encryptedInput.handles[0], encryptedInput.inputProof);

    const encryptedAliceVote = await fheVoteContract.connect(signerAlice).getMyVote();

    const decryptedVote = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedAliceVote,
      fheVoteContractAddress,
      signerAlice
    );

    expect(decryptedVote.toString()).to.equal(choiceMessi.toString());
  });

  it("Bob votes Ronaldo and vote is correct", async function () {
    const choiceRonaldo = 2;
    const signerBob = signers.bob;

    const encryptedInput = await fhevm
      .createEncryptedInput(fheVoteContractAddress, signerBob.address)
      .add32(choiceRonaldo)
      .encrypt();

    await fheVoteContract.connect(signerBob).vote(encryptedInput.handles[0], encryptedInput.inputProof);

    const encryptedBobVote = await fheVoteContract.connect(signerBob).getMyVote();

    const decryptedVote = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBobVote,
      fheVoteContractAddress,
      signerBob
    );

    expect(decryptedVote.toString()).to.equal(choiceRonaldo.toString());
  });

  it("Alice changes vote from Messi to Ronaldo", async function () {
    const signerAlice = signers.alice;

    // Alice votes Messi first
    let encryptedInput = await fhevm
      .createEncryptedInput(fheVoteContractAddress, signerAlice.address)
      .add32(1)
      .encrypt();
    await fheVoteContract.connect(signerAlice).vote(encryptedInput.handles[0], encryptedInput.inputProof);

    // Then Alice votes Ronaldo
    encryptedInput = await fhevm
      .createEncryptedInput(fheVoteContractAddress, signerAlice.address)
      .add32(2)
      .encrypt();
    await fheVoteContract.connect(signerAlice).vote(encryptedInput.handles[0], encryptedInput.inputProof);

    const encryptedAliceVote = await fheVoteContract.connect(signerAlice).getMyVote();
    const decryptedVote = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedAliceVote,
      fheVoteContractAddress,
      signerAlice
    );

    expect(decryptedVote.toString()).to.equal("2");
  });

  it("Users cannot decrypt votes of other users", async function () {
    const { alice, bob } = signers;

    // Alice votes Messi
    const input = await fhevm.createEncryptedInput(fheVoteContractAddress, alice.address).add32(1).encrypt();
    await fheVoteContract.connect(alice).vote(input.handles[0], input.inputProof);

    const encryptedAliceVote = await fheVoteContract.getUserVote(alice.address);

    // Bob tries to decrypt Alice's vote -> should throw
    await expect(
      fhevm.userDecryptEuint(FhevmType.euint32, encryptedAliceVote, fheVoteContractAddress, bob)
    ).to.be.rejectedWith(Error);
  });

  it("Messi total votes should be encrypted but non-zero after votes", async function () {
    const { alice, bob } = signers;

    // Alice -> Messi
    let encryptedInput = await fhevm.createEncryptedInput(fheVoteContractAddress, alice.address).add32(1).encrypt();
    await fheVoteContract.connect(alice).vote(encryptedInput.handles[0], encryptedInput.inputProof);

    // Bob -> Messi
    encryptedInput = await fhevm.createEncryptedInput(fheVoteContractAddress, bob.address).add32(1).encrypt();
    await fheVoteContract.connect(bob).vote(encryptedInput.handles[0], encryptedInput.inputProof);

    const encryptedMessi = await fheVoteContract.getMessiVotes();
    expect(encryptedMessi).to.not.equal(ethers.ZeroHash);
  });

  it("Ronaldo total votes should be encrypted but non-zero after votes", async function () {
    const { alice, bob } = signers;

    // Alice -> Ronaldo
    let encryptedInput = await fhevm.createEncryptedInput(fheVoteContractAddress, alice.address).add32(2).encrypt();
    await fheVoteContract.connect(alice).vote(encryptedInput.handles[0], encryptedInput.inputProof);

    // Bob -> Ronaldo
    encryptedInput = await fhevm.createEncryptedInput(fheVoteContractAddress, bob.address).add32(2).encrypt();
    await fheVoteContract.connect(bob).vote(encryptedInput.handles[0], encryptedInput.inputProof);

    const encryptedRonaldo = await fheVoteContract.getRonaldoVotes();
    expect(encryptedRonaldo).to.not.equal(ethers.ZeroHash);
  });
});
