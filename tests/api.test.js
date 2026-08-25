import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /blockchain", () => {
  it("should return the current blockchain", async () => {
    // Act: request the current blockchain through the Express API.
    const response = await request(app).get("/blockchain");

    // Assert: the endpoint should return a successful HTTP response.
    expect(response.status).toBe(200);

    // Assert: the response should expose the blockchain state.
    expect(response.body).toHaveProperty("chain");
    expect(response.body).toHaveProperty("pendingTransactions");
  });

  it("should reject a transaction without sender", async () => {
    // Arrange: create an invalid transaction without the required sender.
    const invalidTransaction = {
      recipient: "Roastery B",
      batchId: "BATCH-009",
      weightKg: 100,
    };

    // Act: submit the invalid transaction.
    const response = await request(app)
      .post("/transactions")
      .send(invalidTransaction);

    // Assert: the validation middleware must reject the request.
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should reject a transaction without recipient", async () => {
    // Arrange: create an invalid transaction without the required recipient.
    const invalidTransaction = {
      sender: "Coffee Farm A",
      batchId: "BATCH-010",
      weightKg: 100,
    };

    // Act: submit the invalid transaction.
    const response = await request(app)
      .post("/transactions")
      .send(invalidTransaction);

    // Assert: the validation middleware must reject the request.
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should reject a transaction with an invalid weightKg", async () => {
    // Arrange: create a transaction with an invalid non-positive weight.
    const invalidTransaction = {
      sender: "Coffee Farm A",
      recipient: "Roastery B",
      batchId: "BATCH-011",
      weightKg: 0,
    };

    // Act: submit the invalid transaction.
    const response = await request(app)
      .post("/transactions")
      .send(invalidTransaction);

    // Assert: weightKg must be a positive number.
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

// POST / transactiosn and validate middleware

describe("POST /transactions", () => {
  it("should add a valid transaction to the pending transaction pool", async () => {
    // Arrange: create a valid coffee logistics transaction.
    const transaction = {
      sender: "Coffee Farm A",
      recipient: "Roastery B",
      batchId: "BATCH-007",
      weightKg: 100,
    };

    // Act: submit the transaction through the API.
    const response = await request(app).post("/transactions").send(transaction);

    // Assert: a valid transaction should be accepted.
    expect(response.status).toBe(201);

    // Assert: the response should contain the submitted transaction.
    expect(response.body).toHaveProperty("transaction");
    expect(response.body.transaction).toEqual(transaction);
  });

  it("should reject a transaction without batchId", async () => {
    // Arrange: create an invalid transaction without the required batchId.
    const invalidTransaction = {
      sender: "Coffee Farm A",
      recipient: "Roastery B",
      weightKg: 100,
    };

    // Act: submit the invalid transaction.
    const response = await request(app)
      .post("/transactions")
      .send(invalidTransaction);

    // Assert: invalid transaction data must be rejected.
    expect(response.status).toBe(400);
  });
});

describe("POST /mine", () => {
  it("should mine pending transactions into a new block", async () => {
    // Arrange: create a valid transaction through the public API.
    const transaction = {
      sender: "Coffee Farm C",
      recipient: "Cafe D",
      batchId: "BATCH-008",
      weightKg: 80,
    };

    await request(app).post("/transactions").send(transaction);

    // Act: request mining of the pending transaction pool.
    const response = await request(app).post("/mine");

    // Assert: the endpoint should return the newly mined block.
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("block");

    // Assert: the mined block should contain the submitted transaction.
    expect(response.body.block.transactions).toContainEqual(transaction);

    // Assert: the block must expose the required blockchain properties.
    expect(response.body.block).toHaveProperty("index");
    expect(response.body.block).toHaveProperty("timestamp");
    expect(response.body.block).toHaveProperty("previousHash");
    expect(response.body.block).toHaveProperty("nonce");
    expect(response.body.block).toHaveProperty("hash");
  });
});
