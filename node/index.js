import express from "express";
import RateLimit from "express-rate-limit";
import path from "path";
const __dirname = path.resolve();

// Server configuration
const app = express();
const port = 3190;

// Middleware
let options = {
  dotfiles: "ignore", // allow, deny, ignore
  etag: true,
  extensions: ["htm", "html", "js", "css", "ico", "cyjs", "png", "jpg"],
  index: false, // Disables directory indexing - won't serve a whole folder
  // maxAge: "7d", // Expires after 7 days
  redirect: false,
  setHeaders: function (res, path, stat) {
    // Add this to header of all static responses
    res.set("x-timestamp", Date.now());
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// Apply a rate limiter to all requests to prevent DDOS attacks
// let limiter = new RateLimit({ windowMs: 1 * 60 * 1000, max: 5 });
// app.use(limiter);

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

// app.post("/visualization", (req, res) => {
//   const fileName = path.join(
//     __dirname,
//     "node",
//     "PublicResources",
//     "html",
//     "visualization.html"
//   );
//   res.sendFile(fileName);
//   console.log("Sent:", fileName);
// });

app.post("/visualization", (req, res) => {
  const graphAmount = req.body["number-of-graphs"];
  const graphSize = req.body["graph-size"];
  const simulationSPAs = [
    req.body["simulation-1-spa"],
    req.body["simulation-2-spa"],
    req.body["simulation-3-spa"],
  ];

  res.send(
    generateVisualizationHTML(
      generateGraphDivs(graphAmount, graphSize, simulationSPAs)
    )
  );
  console.log(
    `Sent: Visualization with params: Graph amount: ${graphAmount}, graph size: ${graphSize}, simulation SPAs: ${simulationSPAs}`
  );
});

app.get("/visualization-options", (req, res) => {
  const fileName = path.join(
    __dirname,
    "node",
    "PublicResources",
    "html",
    "visualization-options.html"
  );
  res.sendFile(fileName);
  console.log("Sent:", fileName);
});

// Start the server app
app.listen(port, (error) => {
  if (error) console.error(error);
  console.log(`Server listening on port ${port}!`);
});

const generateVisualizationHTML = (graphs) => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <link href="../css/style.css" rel="stylesheet" />
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui"
        />
        <title>Graph Visualization - FCDS</title>
        <link rel="icon" type="image/x-icon" href="../html/favicon.ico" />
      </head>
      <body>
        ${graphs}
    
        <!-- Load application code at the end to ensure DOM is loaded -->
        <script src="../js/graphCore.js" type="module"></script>
        <script src="../js/darkMode.js" type="module"></script>
      </body>
    </html>
    `;
};

const generateGraphDivs = (graphAmount, graphSize, algorithms) => {
  let graphs = `<div style="text-align: center">`;
  for (let i = 0; i < graphAmount; i++) {
    graphs += `<div id="cy${i}" class="cy ${graphSize} ${algorithms[i]}"></div>`;
  }
  graphs += `</div>`;
  return graphs;
};
