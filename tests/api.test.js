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
