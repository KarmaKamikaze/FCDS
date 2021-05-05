import { CyGraph } from "./graphHelper.js";
import { CytoStyle } from "./cytoStylesheet.js";
import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { addDarkBtn } from "./darkMode.js";
import { greedyBestFirstSearch } from "./greedyBestFirstSearch.js";
import { startSimulation } from "./orderGeneration.js";

/**
 * Performs setup and initialization of the input Cytoscape graph
 * @param {CyGraph} cyGraph The CyGraph class to set up
 * @param {File} presetFile The graph preset file to load
 * @param {Function} startSimulationCallback Callback function which starts the simulation
 */
function SetupGraph(
  cyGraph,
  presetFile = null,
  startSimulationCallback,
  tickSpeed
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
      startSimulationCallback(cyGraph, tickSpeed);
    });
}

/**
 * Callback function which starts the simulation once the graph is initialized
 * @param {CyGraph} cyGraph The graph to perform the simulation on
 */
function simulationTest(cyGraph, tickSpeed) {
  startSimulation(cyGraph, tickSpeed);
  console.log(`[${cyGraph.name}] Started simulation`);
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
        : BIG_GRAPH_PRESET_FILE,
    tickSpeed = 1000 / graphSettings["ticks-per-second"];

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
      true, // headless traversal
      graphSettings["courier-frequency"], // max number of couriers
      tickSpeed, // ms per tick
      graphSettings["obstruction-level"]
    );
    graphArray.push(cyGraph);
    SetupGraph(cyGraph, graphSize, simulationTest, tickSpeed);
  }
}

/// MAIN ///
let GRAPH_PRESET_FILE = "../graphPresets/GraphTest1.cyjs";
let BIG_GRAPH_PRESET_FILE = "../graphPresets/GraphBig.cyjs";
const DISTANCE_PER_TICK = 300; // 300 units per tick -> meters per minute -> 18 km/h

let graphArray = [];
startSim();

addDarkBtn(graphArray);
