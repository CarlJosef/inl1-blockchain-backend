# Inl 1 - Blockchain Backend

![Node.js](https://skillicons.dev/icons?i=nodejs)
![Express](https://skillicons.dev/icons?i=express)
![JavaScript](https://skillicons.dev/icons?i=js)
![Git](https://skillicons.dev/icons?i=git)
![GitHub](https://skillicons.dev/icons?i=github)

**Node.js · Express · JavaScript · Vitest · Supertest · Proof-of-Work**

---

## Status

![Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Assignment](https://img.shields.io/badge/Assignment-Inl%201-blue)
![Tests](https://img.shields.io/badge/Tests-17%20Passed-brightgreen)
![Statements](https://img.shields.io/badge/Statements-100%25-brightgreen)
![Branches](https://img.shields.io/badge/Branches-96.29%25-brightgreen)
![Functions](https://img.shields.io/badge/Functions-100%25-brightgreen)
![Lines](https://img.shields.io/badge/Lines-100%25-brightgreen)

---

## Overview

This project is the first examination assignment in the **Blockkedja Backend** course.

The application implements a backend for a decentralized coffee logistics ledger where coffee movements between farms, roasteries and cafés are stored in a blockchain.

Each block is protected using a SHA-256 based **Proof-of-Work** mechanism. Transactions are first stored in a pending transaction pool and are later included in dynamically generated blocks through mining.

The backend exposes a REST API built with Express and has been developed using a **Red-Green Test-Driven Development workflow** with Vitest and Supertest.

---

## Technologies

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,js,git,github,vscode" />
</p>

| Technology       | Purpose                            |
| ---------------- | ---------------------------------- |
| Node.js          | Backend runtime                    |
| Express          | REST API                           |
| JavaScript       | Application language               |
| Node.js `crypto` | SHA-256 hashing                    |
| Vitest           | Unit and integration test runner   |
| Supertest        | Express API integration testing    |
| V8 Coverage      | Code coverage                      |
| dotenv           | Environment variable configuration |
| Git              | Version control and TDD history    |
| GitHub           | Repository and commit traceability |

---

## Features

- SHA-256 block hashing using Node.js built-in `crypto` module
- Proof-of-Work mining using an incrementing nonce
- Configurable mining difficulty
- Test-specific mining difficulty to prevent test timeouts
- Dynamically generated genesis block
- Dynamically generated mined blocks
- Pending transaction pool
- Coffee logistics transactions
- Blockchain integrity validation
- Detection of modified block data
- Detection of invalid `previousHash` links
- Express REST API
- Dedicated transaction validation middleware
- Unit tests with Vitest
- Integration tests with Supertest
- Red-Green TDD commit history
- Code coverage above the VG requirement

---

## Project Structure

```text
inl1-blockchain-backend/
│
├── src/
│   ├── blockchain/
│   │   └── Blockchain.js
│   │
│   ├── middleware/
│   │   └── validateTransaction.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── api.test.js
│   └── blockchain.test.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── vitest.config.js
├── TDD-EVIDENCE.md
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/CarlJosef/inl1-blockchain-backend.git
```

Enter the project directory:

```bash
cd inl1-blockchain-backend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
POW_DIFFICULTY=3
```

The repository contains `.env.example` with the required variables.

### Mining difficulty

The blockchain automatically uses:

```text
NODE_ENV=test
→ difficulty = 1
```

This keeps Proof-of-Work tests fast and prevents test timeouts.

Outside the test environment, the blockchain reads:

```text
POW_DIFFICULTY
```

If no valid value is provided, the application falls back to:

```text
difficulty = 3
```

---

## Running the Server

Start the backend:

```bash
npm start
```

The default server address is:

```text
http://localhost:3000
```

Expected terminal output:

```text
Server is running on port 3000
```

For development with Node.js watch mode:

```bash
npm run dev
```

---

## Running Tests

Run all tests:

```bash
npm test
```

Run Vitest in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

---

## Test Coverage

Current test coverage:

| Metric     | Coverage |
| ---------- | -------: |
| Statements |     100% |
| Branches   |   96.29% |
| Functions  |     100% |
| Lines      |     100% |

The assignment requires at least **80% code coverage for VG**.

The project exceeds that requirement across all measured categories.

---

# REST API

The backend exposes three primary endpoints.

## GET `/blockchain`

Returns the current blockchain and pending transaction pool.

### Request

```http
GET /blockchain
```

### Example response

```json
{
  "chain": [
    {
      "index": 0,
      "timestamp": 1234567890,
      "transactions": [],
      "previousHash": "0",
      "nonce": 0,
      "hash": "..."
    }
  ],
  "pendingTransactions": []
}
```

---

## POST `/transactions`

Adds a new coffee logistics transaction to the pending transaction pool.

### Request

```http
POST /transactions
Content-Type: application/json
```

### Example body

```json
{
  "sender": "Coffee Farm A",
  "recipient": "Roastery B",
  "batchId": "BATCH-001",
  "weightKg": 100
}
```

### Successful response

```text
201 Created
```

Example:

```json
{
  "transaction": {
    "sender": "Coffee Farm A",
    "recipient": "Roastery B",
    "batchId": "BATCH-001",
    "weightKg": 100
  }
}
```

---

## Transaction Validation

`POST /transactions` uses dedicated Express middleware before the transaction reaches the blockchain.

The middleware validates:

- `sender` must be a non-empty string
- `recipient` must be a non-empty string
- `batchId` must be a non-empty string
- `weightKg` must be a finite number greater than zero

Invalid input returns:

```text
400 Bad Request
```

Validation behavior is covered by integration tests.

---

## POST `/mine`

Mines all currently pending transactions into a new blockchain block.

### Request

```http
POST /mine
```

### Successful response

```text
201 Created
```

Example structure:

```json
{
  "block": {
    "index": 1,
    "timestamp": 1234567890,
    "transactions": [
      {
        "sender": "Coffee Farm A",
        "recipient": "Roastery B",
        "batchId": "BATCH-001",
        "weightKg": 100
      }
    ],
    "previousHash": "...",
    "nonce": 42,
    "hash": "000..."
  }
}
```

After successful mining, the pending transaction pool is cleared.

---

# Transaction Structure

Each coffee logistics transaction contains:

```js
{
  (sender, recipient, batchId, weightKg);
}
```

| Field       | Description                         |
| ----------- | ----------------------------------- |
| `sender`    | Current sender of the coffee batch  |
| `recipient` | Destination of the coffee batch     |
| `batchId`   | Identifier for the coffee batch     |
| `weightKg`  | Weight of the shipment in kilograms |

---

# Block Structure

Each block contains:

```js
{
  (index, timestamp, transactions, previousHash, nonce, hash);
}
```

| Field          | Description                               |
| -------------- | ----------------------------------------- |
| `index`        | Position of the block in the chain        |
| `timestamp`    | Time when the block was created           |
| `transactions` | Coffee transactions included in the block |
| `previousHash` | Hash of the previous block                |
| `nonce`        | Number discovered during Proof-of-Work    |
| `hash`         | SHA-256 hash of the block                 |

---

# SHA-256 Hashing

Block hashes are generated using the built-in Node.js `crypto` module.

The hash input is constructed from:

```text
index
timestamp
transactions
previousHash
nonce
```

The resulting value is hashed using SHA-256 and represented as a hexadecimal string.

This means a modification to the stored block data causes a newly calculated hash to differ from the hash originally stored in the block.

---

# Proof-of-Work

Mining is implemented using a nonce-based Proof-of-Work loop.

The blockchain repeatedly calculates:

```text
SHA256(block data + nonce)
```

The nonce starts at:

```text
0
```

and increases until the calculated hash begins with the required number of zeroes.

For example:

```text
difficulty = 1
0...

difficulty = 2
00...

difficulty = 3
000...
```

Only when the target is satisfied is the block considered successfully mined.

---

# Dynamic Block Generation

Blocks are not manually hardcoded into the chain.

The genesis block is created dynamically through:

```js
createGenesisBlock();
```

New transaction blocks are created through:

```js
minePendingTransactions();
```

The mining flow:

```text
pendingTransactions
        ↓
create new block data
        ↓
previousHash = latest block hash
        ↓
Proof-of-Work
        ↓
nonce + valid hash
        ↓
append block to chain
        ↓
clear pendingTransactions
```

---

# Blockchain Validation

The `Blockchain` class implements:

```js
isChainValid();
```

Validation begins at block index `1` because the genesis block has no previous block.

For each block, the method verifies:

1. The stored block hash still matches a newly calculated hash.
2. The block's `previousHash` matches the actual hash of the previous block.

If either validation fails:

```js
false;
```

is returned.

If every block passes:

```js
true;
```

is returned.

Tests verify both modified transaction data and broken `previousHash` links.

---

# Test-Driven Development

The project was developed using a **Red-Green TDD workflow**.

The workflow used throughout development was:

```text
1. Write the test
2. Run the test and verify RED
3. Commit the failing test
4. Implement the required behavior
5. Run the test and verify GREEN
6. Commit the production implementation
```

This development order is preserved in the Git history.

## Required TDD Commit Evidence

Three examples are linked directly below as required by the assignment.

### 1. SHA-256 Hash Calculation

**RED**

https://github.com/CarlJosef/inl1-blockchain-backend/commit/360af4dc659c5c3306cbaa7d79d3d28f343d0ae6

**GREEN**

https://github.com/CarlJosef/inl1-blockchain-backend/commit/00c62bb

### 2. Proof-of-Work Mining

**RED**

https://github.com/CarlJosef/inl1-blockchain-backend/commit/e0203c2

**GREEN**

https://github.com/CarlJosef/inl1-blockchain-backend/commit/e087f74

### 3. Blockchain Validation

**RED**

https://github.com/CarlJosef/inl1-blockchain-backend/commit/0ba6dcc

**GREEN**

https://github.com/CarlJosef/inl1-blockchain-backend/commit/685d498

The complete Red-Green development history, including blockchain initialization, pending transactions, environment configuration and the REST API, is documented in:

**[TDD-EVIDENCE.md](./TDD-EVIDENCE.md)**

---

# Testing

The test suite contains both unit tests and Express integration tests.

## Blockchain tests

The blockchain tests cover:

- SHA-256 hashing
- Proof-of-Work
- nonce generation
- valid blockchain verification
- tampered block detection
- invalid `previousHash` detection
- genesis block creation
- pending transactions
- transaction mining
- environment-based mining difficulty

## API integration tests

Supertest is used to test:

- `GET /blockchain`
- valid `POST /transactions`
- invalid `POST /transactions`
- missing `sender`
- missing `recipient`
- missing `batchId`
- invalid `weightKg`
- `POST /mine`

Current result:

```text
17 tests passed
```

---

# Assignment Requirements

The implementation covers the assignment requirements for:

- Node.js API development
- Express backend server
- Proof-of-Work based blockchain
- SHA-256 using Node.js `crypto`
- pending transactions
- dynamic block generation
- blockchain validation through `isChainValid()`
- Vitest unit tests
- Supertest integration tests
- Red-Green TDD commit history
- input validation middleware
- environment-based mining difficulty
- code coverage above 80%
- documented REST API
- documented setup and execution

---

# Repository

GitHub:

https://github.com/CarlJosef/inl1-blockchain-backend

---

## TDD Documentation

For the full test-first development trace:

**[TDD-EVIDENCE.md](./TDD-EVIDENCE.md)**
