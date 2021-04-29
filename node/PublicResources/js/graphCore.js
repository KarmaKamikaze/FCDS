import { CyGraph, eleType } from "./graphHelper.js";
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
 */
function SetupGraph(cyGraph, presetFile = null, startSimulationCallback) {
  if (presetFile === null) return;

  fetch(presetFile)
    .then((response) => response.json())
    .then((exportedJson) => cyGraph.graph.json(exportedJson))
    // initialize the graph
    .then(function () {
      cyGraph.initializeEdges();
      cyGraph.initializeNodes();
      cyGraph.graph.fit(cyGraph.graph.elements());
      // then call the given start simulation function for this graph
      startSimulationCallback(cyGraph);
    });
}

/**
 * Callback function which starts the simulation once the graph is initialized
 * @param {CyGraph} cyGraph The graph to perform the simulation on
 */
function simulationTest(cyGraph) {
  startSimulation(cyGraph, DEFAULT_TICKSPEED);
  console.log(`started sim in ${cyGraph.name}. `)
}

/**
 * This function determines the intended size of the graph, which should be
 * placed in the div.
 * @param {HTMLDivElement} graph A div element from the visualization html
 * document, containing information about the intended graph properties.
 * @returns A string, indicating if the graph is either small or large.
 */
function getGraphSize(graph) {
  return graph.className.includes("small") ? GRAPH_PRESET_FILE : BIG_GRAPH_PRESET_FILE;
}

/**
 * This function determines the intended algorithm that should run on the
 * network in this div.
 * @param {HTMLDivElement} graph A div element from the visualization html
 * document, containing information about the intended graph properties.
 * @returns A string, indicating if the graph algorithm that should run on
 * the network is either astar, bfs or dijkstra.
 */
 function getAlgorithm(graph) {
  return graph.className.includes("astar")
    ? aStar
    : graph.className.includes("bfs")
    ? greedyBestFirstSearch
    : dijkstra;
}
  
/**
 * This function attaches a cytoscape network and SPA algorithm to each
 * graph div and starts the visualization simulation.
 */
function startSim() {
  document.querySelectorAll(".cy").forEach((graph) => {
    let graphSize = getGraphSize(graph),
        styleSize = graphSize === GRAPH_PRESET_FILE ? "small" : "large";
    let cytoStyle = new CytoStyle(graph.id, styleSize);

    let cyGraph = new CyGraph(graph.id, cytoStyle, getAlgorithm(graph), // graph name, stylesheet and SP-algorithm
                              DISTANCE_PER_TICK, // courier movement speed
                              0.3, // order rate (pr restaurant)
                              true, // use idle zones
                              true, // headless simulation
                              8, // max number of couriers
                              DEFAULT_TICKSPEED); // tickspeed
    graphArray.push(cyGraph);
    SetupGraph(cyGraph, graphSize, simulationTest);
  });
}

/// MAIN ///
let GRAPH_PRESET_FILE = "../graphPresets/GraphTest1.cyjs";
let BIG_GRAPH_PRESET_FILE = "../graphPresets/GraphBig.cyjs";
const DEFAULT_TICKSPEED = 50;
const DISTANCE_PER_TICK = 300; // 300 units per tick -> meters per minute -> 18 km/h

let graphArray = [];
startSim();

addDarkBtn(graphArray);
