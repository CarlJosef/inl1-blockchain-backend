# Inl 1 – Blockchain Backend

Backend assignment built with Node.js, Express, Vitest and a Proof-of-Work blockchain ledger for coffee logistics.

## TDD Evidence

The project is developed using a test-first Red-Green TDD workflow.

Tests are written and committed while failing before the corresponding production implementation is added. This makes the development order directly traceable in the Git history.

### 1. SHA-256 Hash Calculation

#### RED

Failing test written before the hash implementation:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/360af4dc659c5c3306cbaa7d79d3d28f343d0ae6

The test verifies that the blockchain can generate a SHA-256 hash and that the resulting hash is a 64-character hexadecimal string.

#### GREEN

Production implementation added after the failing test:

https://github.com/CarlJosef/inl1-blockchain-backend/commit/00c62bb

The implementation uses Node.js built-in `crypto` module to generate a SHA-256 hash from deterministic block data.

### 2. Proof-of-Work Mining

#### RED

_To be added after the failing Proof-of-Work test has been committed._

#### GREEN

_To be added after the Proof-of-Work implementation passes the test._

### 3. Blockchain Validation

#### RED

_To be added after the failing `isChainValid()` tests have been committed._

#### GREEN

_To be added after the blockchain validation implementation passes the tests._
