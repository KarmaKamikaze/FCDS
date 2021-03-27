import express from "express";
import path from "path";
const __dirname = path.resolve();

// Server configuration
const app = express();
const port = 3000;

// Middleware
let options = {
  dotfiles: "ignore", // allow, deny, ignore
  etag: true,
  extensions: ["htm", "html", "js", "css", "ico", "cyjs", "png", "jpg"],
  index: false, // Disables directory indexing - won't serve a whole folder
  maxAge: "7d", // Expires after 7 days
  redirect: false,
  setHeaders: function (res, path, stat) {
    // Add this to header of all statis responses
    res.set("x-timestamp", Date.now());
  },
};

app.use(
  express.static(path.join(__dirname, "node", "PublicResources"), options)
);
app.use(
  "/node_modules/cytoscape/dist",
  express.static(
    path.join(__dirname, "node_modules", "cytoscape", "dist"),
    options
  )
);

// Routes
app.get("/", (req, res) => {
  const fileName = path.join(
    __dirname,
    "node",
    "PublicResources",
    "html",
    "index.html"
  );
  res.sendFile(fileName);
  console.log("Sent:", fileName);
});

app.post("/visualization", (req, res) => {
  const fileName = path.join(
    __dirname,
    "node",
    "PublicResources",
    "html",
    "visualization.html"
  );
  res.sendFile(fileName);
  console.log("Sent:", fileName);
});

// Start the server app
app.listen(port, (error) => {
  if (error) console.error(error);
  console.log(`Server listening on port ${port}!`);
});
