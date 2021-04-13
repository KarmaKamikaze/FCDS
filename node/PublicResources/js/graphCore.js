import { CyGraph, eleType } from "./graphHelper.js";
import { CytoStyle } from "./cytoStylesheet.js";
import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { addDarkBtn } from "./darkMode.js";
import { greedyBestFirstSearch } from "./greedyBestFirstSearch.js";

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
    })
    .catch((e) => {
      console.error(e);
    });
}

/** Callback function which starts the simulation once the graph is initialized
 *  @param {CyGraph} cyGraph The graph to perform the simulation on
 */
function simulationTest1(cyGraph) {
  cyGraph.addCourier("C2");
  cyGraph.traversePath("courier1", "R1", dijkstra);
}

function simulationTest2(cyGraph) {
  cyGraph.addCourier("C2");
  cyGraph.traversePath("courier1", "R1", aStar);
}

function simulationTest3(cyGraph) {
  cyGraph.addCourier("C2");
  cyGraph.traversePath("courier1", "R1", greedyBestFirstSearch);
}

const setGraphSize = (graph) => {
  if (graph.className.includes("small")) return "small";
  else return "large";
};

const setAlgorithm = (graph) => {
  return graph.className.includes("astar")
    ? "astar"
    : graph.className.includes("bfs")
    ? "bfs"
    : "dijkstra";
};

const startSim = () => {
  document.querySelectorAll("div").forEach((graph) => {
    if (graph.id.includes("cy")) {
      let cytoStyle = new CytoStyle(graph.id);
      let network = new CyGraph(graph.id, cytoStyle);
      graphArray.push(network);

      switch (setAlgorithm(graph)) {
        case "astar":
          if (setGraphSize(graph) === "small") {
            SetupGraph(network, GRAPH_PRESET_FILE, simulationTest2);
          } else {
            SetupGraph(network, BIG_GRAPH_PRESET_FILE, simulationTest2);
          }
          break;

        case "bfs":
          if (setGraphSize(graph) === "small") {
            SetupGraph(network, GRAPH_PRESET_FILE, simulationTest3);
          } else {
            SetupGraph(network, BIG_GRAPH_PRESET_FILE, simulationTest3);
          }
          break;

        case "dijkstra":
          if (setGraphSize(graph) === "small") {
            SetupGraph(network, GRAPH_PRESET_FILE, simulationTest1);
          } else {
            SetupGraph(network, BIG_GRAPH_PRESET_FILE, simulationTest1);
          }
          break;

        default:
          console.error("Graph generation failed.");
          break;
      }
    }
  });
};

/// MAIN ///
let GRAPH_PRESET_FILE = "../graphPresets/GraphTest1.cyjs";
let BIG_GRAPH_PRESET_FILE = "../graphPresets/GraphBig.cyjs";

let graphArray = [];
startSim();

addDarkBtn(graphArray);
