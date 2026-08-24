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

  // ADD proofOfWork() HERE
  proofOfWork(index, timestamp, transactions, previousHash) {
    // Start the nonce at zero and calculate the first candidate hash.
    let nonce = 0;

    let hash = this.calculateHash(
      index,
      timestamp,
      transactions,
      previousHash,
      nonce,
    );

    // Build the target prefix based on the configured mining difficulty.
    // Example: difficulty 2 requires a hash beginning with "00".
    const target = "0".repeat(this.difficulty);

    // Continue incrementing the nonce and recalculating the hash
    // until the resulting SHA-256 hash satisfies the difficulty target.
    while (!hash.startsWith(target)) {
      nonce += 1;

      hash = this.calculateHash(
        index,
        timestamp,
        transactions,
        previousHash,
        nonce,
      );
    }

    // Return both values because the nonce is part of the block data
    // required to reproduce and validate the mined hash later.
    return {
      nonce,
      hash,
    };
  }
}
