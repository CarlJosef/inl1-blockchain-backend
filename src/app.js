import express from "express";
import { validateTransaction } from "./middleware/validateTransaction.js";
import { Blockchain } from "./blockchain/Blockchain.js";

// Create the Express application.
const app = express();

// Enable JSON request parsing for upcoming POST endpoints.
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

app.post("/transactions", validateTransaction, (req, res) => {
  // Add the validated coffee movement to the pending transaction pool.
  const transaction = blockchain.addTransaction(req.body);

  // Return the accepted transaction to the client.
  res.status(201).json({
    transaction,
  });
});

export default app;
