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
