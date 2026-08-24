import express from "express";
import { validateTransaction } from "./middleware/validateTransaction.js";
import { Blockchain } from "./blockchain/Blockchain.js";

// Create the Express application.
const app = express();

// Enable JSON request parsing for POST endpoints.
app.use(express.json());

// Create one blockchain instance that represents
// the current in-memory ledger for this API process.
const blockchain = new Blockchain();

// Return the current blockchain state so clients can
// inspect both completed blocks and pending transactions.
app.get("/blockchain", (req, res) => {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions,
  });
});

// Validate and add a new coffee logistics transaction.
app.post("/transactions", validateTransaction, (req, res) => {
  // Add the validated transaction to the pending transaction pool.
  const transaction = blockchain.addTransaction(req.body);

  // Return the accepted transaction to the client.
  res.status(201).json({
    transaction,
  });
});

// Mine all currently pending transactions into a new blockchain block.
app.post("/mine", (req, res) => {
  // Run the blockchain mining process. This performs Proof-of-Work,
  // creates a new block, adds it to the chain and clears the pending pool.
  const block = blockchain.minePendingTransactions();

  // Return the newly mined block to the client.
  res.status(201).json({
    block,
  });
});

export default app;
