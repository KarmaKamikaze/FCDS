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
  cyGraph.addCourier("R1");
  cyGraph.addCourier("N4");

  startSimulation(cyGraph, DEFAULT_TICKSPEED);
}

/**
 * This function attaches a cytoscape network and SPA algorithm to each
 * graph div and starts the visualization simulation.
 */
const startSim = async () => {
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

  for (let i = 0; i < graphSettings["number-of-graphs"]; i++) {
    let graphDivs = document.querySelectorAll("div.cy");
    let cytoStyle;

    // Selects the correct CytoStyle options based on the graphs size
    if (graphSettings["graph-size"] === "small") {
      cytoStyle = new CytoStyle(graphDivs[i].id, "small");
    } else {
      cytoStyle = new CytoStyle(graphDivs[i].id, "large");
    }

    let network = {};

    switch (graphSettings[`simulation-${i + 1}-spa`]) {
      case "astar":
        network = new CyGraph(
          graphDivs[i].id,
          cytoStyle,
          aStar,
          DEFAULT_TICKSPEED
        );
        graphArray.push(network);
        if (graphSettings["graph-size"] === "small") {
          SetupGraph(network, GRAPH_PRESET_FILE, simulationTest);
        } else {
          SetupGraph(network, BIG_GRAPH_PRESET_FILE, simulationTest);
        }
        break;

      case "bfs":
        network = new CyGraph(
          graphDivs[i].id,
          cytoStyle,
          greedyBestFirstSearch,
          DEFAULT_TICKSPEED
        );
        graphArray.push(network);
        if (graphSettings["graph-size"] === "small") {
          SetupGraph(network, GRAPH_PRESET_FILE, simulationTest);
        } else {
          SetupGraph(network, BIG_GRAPH_PRESET_FILE, simulationTest);
        }
        break;

      case "dijkstra":
        network = new CyGraph(
          graphDivs[i].id,
          cytoStyle,
          dijkstra,
          DEFAULT_TICKSPEED
        );
        graphArray.push(network);
        if (graphSettings["graph-size"] === "small") {
          SetupGraph(network, GRAPH_PRESET_FILE, simulationTest);
        } else {
          SetupGraph(network, BIG_GRAPH_PRESET_FILE, simulationTest);
        }
        break;

      default:
        console.error("Graph generation failed.");
        break;
    }
  }
};

/// MAIN ///
let GRAPH_PRESET_FILE = "../graphPresets/GraphTest1.cyjs";
let BIG_GRAPH_PRESET_FILE = "../graphPresets/GraphBig.cyjs";
const DEFAULT_TICKSPEED = 100;

let graphArray = [];
startSim();

addDarkBtn(graphArray);
