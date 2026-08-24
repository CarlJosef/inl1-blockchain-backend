import { describe, it, expect } from "vitest";
import { Blockchain } from "../src/blockchain/Blockchain.js";

// Test suite for the Blockchain class hash calculation and proof-of-work functionality.
describe("Blockchain hash calculation", () => {
  it("should calculate a SHA-256 hash for block data", () => {
    // Arrange :-) create a blockchain instance and deterministic block data.
    const blockchain = new Blockchain();

    const transactions = [
      {
        sender: "Farm A",
        recipient: "Roastery B",
        batchId: "BATCH-001",
        weightKg: 100,
      },
    ];

    // The act: calculate the hash for the supplied block data.
    const hash = blockchain.calculateHash(
      1,
      1234567890,
      transactions,
      "previous-hash",
      0,
    );

    // Assert: SHA-256 hashes are hexadecimal strings with 64 characters.
    expect(hash).toBeTypeOf("string");
    expect(hash).toHaveLength(64);
  });
});

describe("Blockchain proof-of-work", () => {
  it("should mine a hash that matches the configured difficulty", () => {
    // Arrange: create a blockchain instance and use a low difficulty
    // so my test can complete quickly during development.
    const blockchain = new Blockchain();
    blockchain.difficulty = 1;

    const transactions = [
      {
        sender: "Farm A",
        recipient: "Roastery B",
        batchId: "BATCH-002",
        weightKg: 75,
      },
    ];

    // Act: Attempt to mine a valid block hash.
    const result = blockchain.proofOfWork(
      1,
      1234567890,
      transactions,
      "previous-hash",
    );

    // Assert: the mined hash must satisfy the configured difficulty.
    expect(result.hash.startsWith("0".repeat(blockchain.difficulty))).toBe(
      true,
    );

    // Assert: the mining process must return the nonce
    // used to produce the valid hash.
    expect(result.nonce).toBeTypeOf("number");
    expect(result.nonce).toBeGreaterThanOrEqual(0);
  });
});

describe("Blockchain validation", () => {
  it("should return true for a valid blockchain", () => {
    // Arrange: create a blockchain instance with a manually prepared
    // valid chain structure for the validation test.
    const blockchain = new Blockchain();

    const genesisBlock = {
      index: 0,
      timestamp: 1234567890,
      transactions: [],
      previousHash: "0",
      nonce: 0,
    };

    genesisBlock.hash = blockchain.calculateHash(
      genesisBlock.index,
      genesisBlock.timestamp,
      genesisBlock.transactions,
      genesisBlock.previousHash,
      genesisBlock.nonce,
    );

    const secondBlock = {
      index: 1,
      timestamp: 1234567891,
      transactions: [
        {
          sender: "Farm A",
          recipient: "Roastery B",
          batchId: "BATCH-003",
          weightKg: 50,
        },
      ],
      previousHash: genesisBlock.hash,
      nonce: 0,
    };

    secondBlock.hash = blockchain.calculateHash(
      secondBlock.index,
      secondBlock.timestamp,
      secondBlock.transactions,
      secondBlock.previousHash,
      secondBlock.nonce,
    );

    blockchain.chain = [genesisBlock, secondBlock];

    // Act and Assert: an unchanged blockchain must be considered valid.
    expect(blockchain.isChainValid()).toBe(true);
  });

  it("should return false when block data has been tampered with", () => {
    // Arrange: create a valid two-block chain.
    const blockchain = new Blockchain();

    const genesisBlock = {
      index: 0,
      timestamp: 1234567890,
      transactions: [],
      previousHash: "0",
      nonce: 0,
    };

    genesisBlock.hash = blockchain.calculateHash(
      genesisBlock.index,
      genesisBlock.timestamp,
      genesisBlock.transactions,
      genesisBlock.previousHash,
      genesisBlock.nonce,
    );

    const secondBlock = {
      index: 1,
      timestamp: 1234567891,
      transactions: [
        {
          sender: "Farm A",
          recipient: "Roastery B",
          batchId: "BATCH-004",
          weightKg: 50,
        },
      ],
      previousHash: genesisBlock.hash,
      nonce: 0,
    };

    secondBlock.hash = blockchain.calculateHash(
      secondBlock.index,
      secondBlock.timestamp,
      secondBlock.transactions,
      secondBlock.previousHash,
      secondBlock.nonce,
    );

    blockchain.chain = [genesisBlock, secondBlock];

    // Tamper with the transaction after the block hash has been calculated.
    blockchain.chain[1].transactions[0].weightKg = 999;

    // Act and Assert: changed block data must invalidate the chain.
    expect(blockchain.isChainValid()).toBe(false);
  });

  it("should return false when previousHash does not match the previous block", () => {
    // Arrange: create a valid two-block chain.
    const blockchain = new Blockchain();

    const genesisBlock = {
      index: 0,
      timestamp: 1234567890,
      transactions: [],
      previousHash: "0",
      nonce: 0,
    };

    genesisBlock.hash = blockchain.calculateHash(
      genesisBlock.index,
      genesisBlock.timestamp,
      genesisBlock.transactions,
      genesisBlock.previousHash,
      genesisBlock.nonce,
    );

    const secondBlock = {
      index: 1,
      timestamp: 1234567891,
      transactions: [],
      previousHash: genesisBlock.hash,
      nonce: 0,
    };

    secondBlock.hash = blockchain.calculateHash(
      secondBlock.index,
      secondBlock.timestamp,
      secondBlock.transactions,
      secondBlock.previousHash,
      secondBlock.nonce,
    );

    blockchain.chain = [genesisBlock, secondBlock];

    // Break the link between the current block and the previous block.
    blockchain.chain[1].previousHash = "invalid-previous-hash";

    // Recalculate the current block hash so this test specifically
    // exercises the previousHash-link validation branch.
    blockchain.chain[1].hash = blockchain.calculateHash(
      blockchain.chain[1].index,
      blockchain.chain[1].timestamp,
      blockchain.chain[1].transactions,
      blockchain.chain[1].previousHash,
      blockchain.chain[1].nonce,
    );

    // Act and Assert: an invalid block link must invalidate the chain.
    expect(blockchain.isChainValid()).toBe(false);
  });
});

// Test suite for the Blockchain class initialization and genesis block creation.
describe("Blockchain initialization", () => {
  it("should initialize with a genesis block and an empty pending transaction pool", () => {
    // Arrange and Act: create a new blockchain instance.
    const blockchain = new Blockchain();

    // Assert: the chain should start with exactly one genesis block.
    expect(blockchain.chain).toHaveLength(1);

    // Assert: pending transactions should start as an empty array.
    expect(blockchain.pendingTransactions).toEqual([]);

    // Assert: verify the expected core properties of the genesis block.
    expect(blockchain.chain[0]).toHaveProperty("index", 0);
    expect(blockchain.chain[0]).toHaveProperty("transactions");
    expect(blockchain.chain[0]).toHaveProperty("previousHash", "0");
    expect(blockchain.chain[0]).toHaveProperty("nonce");
    expect(blockchain.chain[0]).toHaveProperty("hash");
  });
});

//
describe("Pending transactions", () => {
  it("should add a transaction to the pending transaction pool", () => {
    // Arrange: create a new blockchain and a valid coffee transaction.
    const blockchain = new Blockchain();

    const transaction = {
      sender: "Coffee Farm A",
      recipient: "Roastery B",
      batchId: "BATCH-005",
      weightKg: 120,
    };

    // Act: add the transaction to the pending transaction pool.
    blockchain.addTransaction(transaction);

    // Assert: the transaction should now be stored as pending.
    expect(blockchain.pendingTransactions).toHaveLength(1);
    expect(blockchain.pendingTransactions[0]).toEqual(transaction);
  });
});

describe("Pending transaction mining", () => {
  it("should mine pending transactions into a new block", () => {
    // Arrange: create a blockchain with low mining difficulty
    // so the test completes quickly.
    const blockchain = new Blockchain();
    blockchain.difficulty = 1;

    const transaction = {
      sender: "Coffee Farm A",
      recipient: "Roastery B",
      batchId: "BATCH-006",
      weightKg: 90,
    };

    blockchain.addTransaction(transaction);

    const previousBlock = blockchain.chain[0];

    // Act: mine all currently pending transactions.
    const minedBlock = blockchain.minePendingTransactions();

    // Assert: a new block should have been added to the chain.
    expect(blockchain.chain).toHaveLength(2);

    // Assert: the mined block should contain the pending transaction.
    expect(minedBlock.transactions).toEqual([transaction]);

    // Assert: the new block must point to the previous block hash.
    expect(minedBlock.previousHash).toBe(previousBlock.hash);

    // Assert: the mined block hash must satisfy the configured difficulty.
    expect(minedBlock.hash.startsWith("0".repeat(blockchain.difficulty))).toBe(
      true,
    );

    // Assert: the pending transaction pool must be cleared after mining.
    expect(blockchain.pendingTransactions).toEqual([]);
  });
});
