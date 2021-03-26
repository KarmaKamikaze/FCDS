import { CyGraph, eleType } from "./graphHelper.js";
import { CytoStyle } from "./cytoStylesheet.js";
import { startSimulation } from "./orderGeneration.js";

let GRAPH_PRESET_FILE = "../graphPresets/GraphTest1.cyjs";
const TICKSPEED = 250;

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
  cyGraph.addCourier("N2");
  cyGraph.addCourier("N2");
  cyGraph.addCourier("N2");
  cyGraph.addCourier("N2");
  cyGraph.addCourier("N2");
  startSimulation(cyGraph, TICKSPEED);
  /*   cyGraph.traversePath("courier1", "R1");
    cyGraph.traversePath("courier2", "R2"); */
}

function simulationTest2(cyGraph) {
  cyGraph.addCourier("C2");
  cyGraph.delNode(cyGraph.getEdgeId("C2", "N1"));
  cyGraph.delNode(cyGraph.getEdgeId("C2", "N2"));
  cyGraph.delNode(cyGraph.getEdgeId("N2", "N1"));
  cyGraph.addEdge("C2N2", "N2", "C2", false);
  cyGraph.addEdge("N1N2", "N1", "N2", false);
  cyGraph.addEdge("C2N1", "C2", "N1", false);
  cyGraph.addEdge("C2N5", "N5", "C2", true);
  cyGraph.delNode(cyGraph.getEdgeId("N4", "R1"));
  cyGraph.addEdge("N4R1", "R1", "N4", false);
  //cyGraph.addEdge("N2", "R1")

  cyGraph.traversePath("courier1", "R1");
}

/// MAIN ///

let graph1 = new CyGraph("Cy1", cy1, TICKSPEED);
// let graph2 = new CyGraph("Cy2", cy2);
SetupGraph(graph1, GRAPH_PRESET_FILE, simulationTest1);
/* SetupGraph(graph2, GRAPH_PRESET_FILE, simulationTest2);
 */