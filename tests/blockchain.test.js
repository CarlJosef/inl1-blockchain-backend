import { describe, it, expect } from "vitest";
import { Blockchain } from "../src/blockchain/Blockchain.js";

describe("Blockchain hash calculation", () => {
  it("should calculate a SHA-256 hash for block data", () => {
    // Arrange: create a blockchain instance and deterministic block data.
    const blockchain = new Blockchain();

    const transactions = [
      {
        sender: "Farm A",
        recipient: "Roastery B",
        batchId: "BATCH-001",
        weightKg: 100,
      },
    ];

    // Act: calculate the hash for the supplied block data.
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
