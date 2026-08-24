export function validateTransaction(req, res, next) {
  // Read the expected transaction fields from the request body.
  const { sender, recipient, batchId, weightKg } = req.body;

  // Validate that sender is a non-empty string.
  if (typeof sender !== "string" || sender.trim() === "") {
    return res.status(400).json({
      error: "sender is required and must be a non-empty string",
    });
  }

  // Validate that recipient is a non-empty string.
  if (typeof recipient !== "string" || recipient.trim() === "") {
    return res.status(400).json({
      error: "recipient is required and must be a non-empty string",
    });
  }

  // Validate that batchId is a non-empty string.
  if (typeof batchId !== "string" || batchId.trim() === "") {
    return res.status(400).json({
      error: "batchId is required and must be a non-empty string",
    });
  }

  // Validate that weightKg is a finite number greater than zero.
  if (
    typeof weightKg !== "number" ||
    !Number.isFinite(weightKg) ||
    weightKg <= 0
  ) {
    return res.status(400).json({
      error: "weightKg is required and must be a positive number",
    });
  }

  // Continue to the endpoint when the transaction is valid.
  next();
}
