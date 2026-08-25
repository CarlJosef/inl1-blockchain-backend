# Inl 1 - Blockchain Backend

Backend assignment built with Node.js, Express, Vitest and a Proof-of-Work blockchain ledger for coffee logistics.

## TDD Evidence

The project is developed using a test-first Red-Green TDD workflow.

Tests are written and committed while failing before the corresponding production implementation is added. This makes the development order directly traceable in the Git history.

---

### 1. SHA-256 Hash Calculation

#### RED

Failing test written before the hash implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/360af4dc659c5c3306cbaa7d79d3d28f343d0ae6

The test verifies that the blockchain can generate a SHA-256 hash and that the resulting hash is a 64-character hexadecimal string.

#### GREEN

Production implementation added after the failing test:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/00c62bb

The implementation uses Node.js built-in `crypto` module to generate a SHA-256 hash from deterministic block data.

---

### 2. Proof-of-Work Mining

#### RED

Failing test written before the Proof-of-Work implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/e0203c2

The test verifies that the mining process must return a hash that satisfies the configured difficulty and a valid nonce.

#### GREEN

Production implementation added after the failing test:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/e087f74

The implementation uses a nonce-based mining loop that repeatedly recalculates the SHA-256 hash until the configured Proof-of-Work difficulty is satisfied.

---

### 3. Blockchain Validation

#### RED

Failing tests written before the `isChainValid()` implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/0ba6dcc

The tests verify that a valid blockchain returns `true`, that tampered block data returns `false`, and that an invalid `previousHash` link also returns `false`.

#### GREEN

Production implementation added after the failing tests:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/685d498

The implementation iterates through the blockchain from block index 1, recalculates each block hash, verifies the stored hash, and checks that each block points to the hash of the previous block.

---

### 4. Blockchain Initialization

#### RED

Failing test written before the blockchain initialization logic:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/cf1bd9e

The test verifies that a new blockchain starts with one dynamically created genesis block and an empty `pendingTransactions` array.

#### GREEN

Production implementation added after the failing test:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/cc99b7e

The implementation creates the genesis block dynamically through `createGenesisBlock()` and initializes an empty pending transaction pool.

---

### 5. Pending Transactions

#### RED

Failing test written before the pending transaction implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/78e32ac

The test verifies that a new coffee transaction is added to the `pendingTransactions` array before it is included in a mined block.

#### GREEN

Production implementation added after the failing test:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/a8c95e8

The implementation adds transactions to the pending transaction pool through `addTransaction()` and returns the added transaction to the caller.

---

### 6. Pending Transaction Mining

#### RED

Failing test written before the pending transaction mining implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/21950d4

The test verifies that pending transactions are dynamically mined into a new block, that the block references the previous block hash, that the mined hash satisfies the configured Proof-of-Work difficulty, and that the pending transaction pool is cleared after mining.

#### GREEN

Production implementation added after the failing test:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/966438d

The implementation dynamically creates a new block from the pending transaction pool, runs Proof-of-Work, links the block to the previous block, appends it to the blockchain, and clears the pending transactions after successful mining.

---

### 7. Environment-Based Mining Difficulty

#### RED

Failing tests written before the environment-based difficulty configuration:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/9d5f3e2

The tests verify that the blockchain uses difficulty `1` when `NODE_ENV` is set to `test`, and that a configured production difficulty is used outside the test environment.

#### GREEN

Production implementation added after the failing tests:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/cc49f77

The implementation configures Proof-of-Work difficulty from environment variables, forces difficulty `1` in the test environment, and falls back to difficulty `3` when no valid production value is provided.

---

### 8. GET /blockchain API

#### RED

Failing Supertest integration test written before the Express endpoint implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/c3a3f12

The test verifies that `GET /blockchain` returns HTTP status `200` and exposes both the completed blockchain and the pending transaction pool.

#### GREEN

Production implementation added after the failing integration test:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/9286df8

The implementation adds the Express `GET /blockchain` endpoint and returns the current in-memory blockchain state as JSON.

---

### 9. POST /transactions API

#### RED

Failing Supertest integration tests written before the transaction endpoint implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/14e73d0

The tests verify that a valid coffee transaction is accepted with HTTP status `201`, and that an invalid transaction without `batchId` is rejected.

#### GREEN

Production implementation added after the failing integration tests:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/387a414

The implementation adds `POST /transactions`, uses dedicated validation middleware, stores valid transactions in the pending transaction pool, and returns HTTP status `400` for invalid input.

---

### 10. POST /mine API

#### RED

Failing Supertest integration test written before the mining endpoint implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/d09c2b5

The test verifies that `POST /mine` mines the current pending transactions into a new block and returns the newly created block with the required blockchain properties.

#### GREEN

Production implementation added after the failing integration test:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/1ac5e58

The implementation adds `POST /mine`, invokes the blockchain mining flow, creates a new Proof-of-Work block from the pending transaction pool, and returns the mined block with HTTP status `201`.

---
