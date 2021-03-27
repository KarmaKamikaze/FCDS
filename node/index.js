import express from "express";
import path from "path";
const __dirname = path.resolve();

// Server configuration
const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "node", "PublicResources")));
app.use(
  "/node_modules/cytoscape/dist",
  express.static(path.join(__dirname, "node_modules", "cytoscape", "dist"))
);

// Routes
app.get("/", (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "node", "PublicResources", "html", "index.html")
  );
});

// Start the server app
app.listen(port, (error) => {
  if (error) console.error(error);
  console.log(`Server listening on port ${port}!`);
});
