import express from "express";
import RateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import path from "path";
const __dirname = path.resolve();

// Server configuration
const app = express();
const port = 3190;

// Dynamic site generation

/**
 * This function generates the visualization html page, which can then be sent as a response to a GET request.
 * @param {String} graphs A deposited div html element in string form, representing the graph container
 * @returns A string, which contains the generated visualization.html site.
 */
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

/**
 * This function generates an amount of divs to contain graph networks on the html page.
 * @param {Number} graphAmount The number of graph divs to generate. This value is usually
 * requested by the user.
 * @param {String} graphSize The size of the graphs which will be contained in the divs.
 * @param {String} algorithms The different types of algorithms associated with each graph div.
 * @returns A string, which contains the specified amount of graph divs in series. The graph will
 * have an id and three classes associated with it: The cy tag, the size of the graph which will
 * be placed in the div and the algorithm that should be used.
 */
const generateGraphDivs = (graphAmount, graphSize, algorithms) => {
  let graphs = `<div style="text-align: center">`;
  for (let i = 0; i < graphAmount; i++) {
    graphs += `<div id="cy${i}" class="cy ${graphSize} ${algorithms[i]}"></div>`;
  }
  graphs += `</div>`;
  return graphs;
};

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
let limiter = new RateLimit({ windowMs: 1 * 60 * 1000, max: 5 });
app.use(limiter);

// Validation rules
let visualizationValidate = [
  body("number-of-graphs").isLength({ max: 1 }).isNumeric().toInt().escape(),
  body("graph-size").isLength({ max: 5 }).trim().toLowerCase().escape(),
  body("simulation-1-spa").trim().toLowerCase().escape(),
  body("simulation-2-spa").trim().toLowerCase().escape(),
  body("simulation-3-spa").trim().toLowerCase().escape(),
];

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

app.post("/visualization", visualizationValidate, (req, res) => {
  // Validate request and check for an empty body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors);
    return res.status(422).json({ errors: errors.array() });
  }

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
