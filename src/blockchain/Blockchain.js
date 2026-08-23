import crypto from "node:crypto";

export class Blockchain {
  constructor() {
    // The constructor is intentionally minimal at this stage.
    // Additional blockchain state will be added in later TDD cycles.
  }

  calculateHash(index, timestamp, transactions, previousHash, nonce) {
    // Combine the block data into one deterministic string.
    const data = [
      index,
      timestamp,
      JSON.stringify(transactions),
      previousHash,
      nonce,
    ].join("");

    // Generate a SHA-256 hash using Node.js built-in crypto module.
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}
