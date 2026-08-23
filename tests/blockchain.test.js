import { describe, it, expect } from "vitest";
import { Blockchain } from "../src/blockchain/Blockchain.js";

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
