import { CyGraph, eleType } from "./graphHelper.js";
import { CytoStyle } from "./cytoStylesheet.js";
import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { greedyBestFirstSearch } from "./greedyBestFirstSearch.js";

let GRAPH_PRESET_FILE = "../graphPresets/GraphTest1.cyjs";

let Viewport = {
  // get width and height of the graph container class from the stylesheet
  width: parseInt(
    getComputedStyle(document.getElementsByClassName("cy")[0]).width
  ),
  height: parseInt(
    getComputedStyle(document.getElementsByClassName("cy")[0]).height
  ),
};

let cy1 = new CytoStyle("cy1");
let cy2 = new CytoStyle("cy2");
let cy3 = new CytoStyle("cy3");

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

/// MAIN ///
let graph1 = new CyGraph("Cy1", cy1);
let graph2 = new CyGraph("Cy2", cy2);
let graph3 = new CyGraph("Cy3", cy3);
SetupGraph(graph1, GRAPH_PRESET_FILE, simulationTest1);
SetupGraph(graph2, GRAPH_PRESET_FILE, simulationTest2);
SetupGraph(graph3, GRAPH_PRESET_FILE, simulationTest3);
