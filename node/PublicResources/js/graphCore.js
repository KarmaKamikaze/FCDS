import { CyGraph } from "./graphHelper.js";
import { CytoStyle } from "./cytoStylesheet.js";
import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { greedyBestFirstSearch } from "./greedyBestFirstSearch.js";
import { startSimulation } from "./orderGeneration.js";
import { runAllTests } from "./tests.js";

export { SetupGraph, simulationTest, getAlgorithm, startSim };

/**
 * Performs setup and initialization of the input Cytoscape graph
 * @param {Class} cyGraph The CyGraph class to set up
 * @param {File} presetFile The graph preset file to load
 * @param {Function} startSimulationCallback Callback function which starts the simulation
 * @param {Number} tickDuration the desired miliseconds per simulation tick
 */
function SetupGraph(
  cyGraph,
  presetFile = null,
  startSimulationCallback,
  tickDuration
) {
  if (presetFile === null) {
    startSimulation(cyGraph);
    return;
  }

  fetch(presetFile)
    .then((response) => response.json())
    .then((exportedJson) => cyGraph.graph.json(exportedJson))
    // initialize the graph
    .then(function () {
      cyGraph.initializeEdges();
      cyGraph.initializeNodes();
      cyGraph.graph.fit(cyGraph.graph.elements());
      // then call the given start simulation function for this graph
      startSimulationCallback(cyGraph, tickDuration);
    });
}

/**
 * Callback function which starts the simulation once the graph is initialized
 * @param {Class} cyGraph The graph to perform the simulation on
 * @param {Number} tickDuration the desired miliseconds per simulation tick
 */
function simulationTest(cyGraph, tickDuration) {
  cyGraph.simHandler = startSimulation(cyGraph, tickDuration);
  runAllTests();
  console.log(
    `[${cyGraph.name}] Started simulation with settings:\n${JSON.stringify(
      cyGraph.settings,
      null,
      4
    )}`
  );
}

/**
 * This function determines the intended algorithm that should run on the
 * network in this div.
 * @param {String} graph A string containing the name of the intended algorithm.
 * @returns The SPA that corresponds to the string parameter.
 */
function getAlgorithm(graph) {
  return graph === "astar"
    ? aStar
    : graph === "bfs"
    ? greedyBestFirstSearch
    : dijkstra;
}

/**
 * This function attaches a cytoscape network and SPA algorithm to each
 * graph div and starts the visualization simulation.
 */
async function startSim() {
  let graphDivs = document.querySelectorAll("div.cy");
  let graphSettings = {};

  try {
    const response = await fetch("../js/HTMLRequestParams.json");
    if (!response.ok) {
      const errorMessage = `An error occurred: ${response.status}`;
      throw new Error(errorMessage);
    }
    graphSettings = await response.json();
  } catch (err) {
    console.log(err);
  }

  let graphSize =
    graphSettings["graph-size"] === "small"
      ? GRAPH_PRESET_FILE
      : graphSettings["graph-size"] === "large"
      ? BIG_GRAPH_PRESET_FILE
      : AALBORG_GRAPH;
  let tickDuration = 1000 / graphSettings["ticks-per-second"];

  for (let i = 0; i < graphSettings["number-of-graphs"]; i++) {
    let cytoStyle = new CytoStyle(
      graphDivs[i].id,
      graphSettings["graph-size"],
      graphDivs[i].classList.contains("headless")
    );

    let cyGraph = new CyGraph(
      graphDivs[i].id,
      cytoStyle,
      getAlgorithm(graphSettings[`simulation-${i + 1}-spa`]), // graph name, stylesheet and SP-algorithm
      DISTANCE_PER_TICK, // courier movement speed
      graphSettings["order-frequency"], // order rate (pr restaurant)
      graphSettings["idle-zones"], // use idle zones
      graphDivs[i].classList.contains("headless"), // headless traversal
      graphSettings["courier-frequency"], // max number of couriers
      tickDuration, // ms per tick
      graphSettings["obstruction-level"]
    );
    graphArray.push(cyGraph);
    cyGraph.settings = graphSettings;
    SetupGraph(cyGraph, graphSize, simulationTest, tickDuration);
  }
}

/// MAIN ///
let GRAPH_PRESET_FILE = "../graphPresets/graphRegular.cyjs";
let BIG_GRAPH_PRESET_FILE = "../graphPresets/graphBig.cyjs";
let AALBORG_GRAPH = "../graphPresets/graphAalborg.cyjs";
const DISTANCE_PER_TICK = 300; // 300 units per tick -> meters per minute -> 18 km/h

let graphArray = [];

startSim();
