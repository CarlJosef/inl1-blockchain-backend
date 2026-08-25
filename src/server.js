import "dotenv/config";
import app from "./app.js";

// Read the HTTP port from the environment.
// Fall back to port 3000 for local development.
const port = Number(process.env.PORT) || 3000;

// Start the Express server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
