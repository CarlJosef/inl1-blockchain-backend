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

  isChainValid() {
    // Start at block index 1 because the genesis block has no previous block
    // to compare against.
    for (let i = 1; i < this.chain.length; i += 1) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Recalculate the current block hash from its stored data.
      const recalculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.transactions,
        currentBlock.previousHash,
        currentBlock.nonce,
      );

      // If the stored hash no longer matches the recalculated hash,
      // the block data has been modified.
      if (currentBlock.hash !== recalculatedHash) {
        return false;
      }

      // Verify that the current block still points to the actual hash
      // of the previous block in the chain.
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    // If every block passes both integrity checks, the chain is valid.
    return true;
  }
}
