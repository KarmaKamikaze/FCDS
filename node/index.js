import express from "express";
import RateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import {
  generateVisualizationHTML,
  generateGraphDivs,
  generateOptionsHTML,
  generateHeadlessHTML,
} from "./PublicResources/js/dynamicPageGeneration.js";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

// Server configuration
const app = express();
const port = 3190;

// Object that holds information about the two end points
const pageObject = {
  visualization: {
    title: "Graph Visualization Options",
    formaction: "visualization",
    h1: "Visualization",
  },
  headless: {
    title: "Headless Simulation Options",
    formaction: "headless-simulation",
    h1: "Simulation",
  },
};

// Middleware
let options = {
  dotfiles: "ignore", // allow, deny, ignore
  etag: true,
  extensions: ["htm", "html", "js", "css", "ico", "cyjs", "png", "jpg", "json"],
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
let validateParameters = [
  body("number-of-graphs").isLength({ max: 1 }).isNumeric().toInt().escape(),
  body("graph-size").isLength({ min: 5, max: 5 }).trim().toLowerCase().escape(),
  body("simulation-1-spa").trim().toLowerCase().escape(),
  body("simulation-2-spa").trim().toLowerCase().escape(),
  body("simulation-3-spa").trim().toLowerCase().escape(),
  body("idle-zones").isLength({ max: 2 }).isNumeric().toInt().escape(),
  body("order-frequency").isLength({ max: 4 }).isNumeric().toFloat().escape(),
  body("ticks-per-second").isLength({ max: 3 }).isNumeric().toInt().escape(),
  body("courier-frequency").isLength({ max: 2 }).isNumeric().toInt().escape(),
];

/**
 * Validates request and check for an empty body
 * @param {Object} req The request object, received from the client
 * @param {Object} res The response object, used to respond to the client if an error occurs.
 * @returns The response, which sends an error message to the client.
 */
const inputValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors);
    return res.status(422).json({ errors: errors.array() });
  }
};

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

app.post("/visualization", validateParameters, (req, res) => {
  inputValidation(req, res);

  // Write request parameters into json file
  const requestData = JSON.stringify(req.body);
  fs.writeFileSync(
    path.join(
      __dirname,
      "node",
      "PublicResources",
      "js",
      "HTMLRequestParams.json"
    ),
    requestData
  );

  res.send(
    generateVisualizationHTML(
      generateGraphDivs(req.body["number-of-graphs"], "visualization")
    )
  );
  console.log(
    `Sent: Visualization with params: ` +
      `Graph amount: ${req.body["number-of-graphs"]}, ` +
      `graph size: ${req.body["graph-size"]}, ` +
      `simulation SPAs: ${req.body["simulation-1-spa"]} ` +
      `${req.body["simulation-2-spa"]} ` +
      `${req.body["simulation-3-spa"]}, ` +
      `idle zones: ${req.body["idle-zones"]}, ` +
      `order frequency: ${req.body["order-frequency"]}, ` +
      `ticks per second: ${req.body["ticks-per-second"]}, ` +
      `courier frequency: ${req.body["courier-frequency"]}.`
  );
});

app.get("/visualization-options", (req, res) => {
  res.send(generateOptionsHTML(pageObject.visualization));
  console.log("Sent: Simulations visualization options page");
});

app.get("/headless-options", (req, res) => {
  res.send(generateOptionsHTML(pageObject.headless));
  console.log("Sent: Headless simulation options page");
});

app.post("/headless-simulation", validateParameters, (req, res) => {
  inputValidation(req, res);

  // Write request parameters into json file
  const requestData = JSON.stringify(req.body);
  fs.writeFileSync(
    path.join(
      __dirname,
      "node",
      "PublicResources",
      "js",
      "HTMLRequestParams.json"
    ),
    requestData
  );

  res.send(
    generateHeadlessHTML(
      req.body["graph-size"],
      req.body["simulation-1-spa"],
      generateGraphDivs(req.body["number-of-graphs"], "headless-simulation")
    )
  );
  console.log(
    `Sent: Headless simulation with params: ` +
      `Graph amount: ${req.body["number-of-graphs"]}, ` +
      `graph size: ${req.body["graph-size"]}, ` +
      `simulation SPA: ${req.body["simulation-1-spa"]}, ` +
      `idle zones: ${req.body["idle-zones"]}, ` +
      `order frequency: ${req.body["order-frequency"]} ` +
      `ticks per second: ${req.body["ticks-per-second"]} ` +
      `courier frequency: ${req.body["courier-frequency"]}.`
  );
});

// Start the server app
app.listen(port, (error) => {
  if (error) console.error(error);
  console.log(`Server listening on port ${port}!`);
});
