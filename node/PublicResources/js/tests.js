//Graph imports
import "../../../node_modules/cytoscape/dist/cytoscape.min.js";
import {
  SetupGraph,
  simulationTest,
  setGraphSize,
  setAlgorithm,
  startSim,
} from "./graphCore";
import { CyGraph, eleType } from "./graphHelper.js";
import { CytoStyle } from "./cytoStylesheet.js";
import { addDarkBtn } from "./darkMode.js";
import { SimStats, updateStats } from "./stats.js";
import { generateHeatmap } from "./heatGeneration.js";
import {
  startSimulation,
  orderIntensity,
  timeToFloat,
} from "./orderGeneration.js";

//Traversal imports
import {
  initializeSingleSource,
  relax,
  traceback,
  heuristicApprox,
} from "../js/pathModules.js";
import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { greedyBestFirstSearch } from "./greedyBestFirstSearch.js";
import { PriorityQueue } from "./queue.js";

export { runAllTests };

let TEST_GRAPH_PRESET_FILE = "../graphPresets/TestGraph.cyjs";

var testCy = cytoscape({
  container: document.getElementById(null), // container to render in
});

function refreshGraph() {
  let testGraph = new CyGraph("Test", testCy);
  SetupGraph(testGraph, TEST_GRAPH_PRESET_FILE, () => {});
}

refreshGraph();

//Test if PFA reaches unreachable end node
let startNode = testGraph.graph.getElementById(`N1`);
let endNode = testGraph.graph.getElementById(`N7`);

//For Dijkstra
dijkstra(testGraph, startNode);
let path = traceback(testGraph, endNode);
let expected = new Error("No possible path to end node");
let actual = "sat";
console.assert(expected === actual);

refreshGraph();

//For A*

//For Greedy Best First Search

//Test if PFA reaches end node from start node with no edges
startNode = testGraph.graph.getElementById(`N7`);
endNode = testGraph.graph.getElementById(`N1`);

//For Dijkstra

//Test if PFA reaches reachable end node with expected path
endNode = testGraph.graph.getElementById(`N5`);

//For A*
/*
dijkstra(testGraph, startNode);
let path = traceback(testGraph, endNode);
greedyBestFirstSearch(testGraph, startNode, endNode);
aStar(testGraph, startNode, endNode);*/

//Integration tests

//Unit test

function runAllTests() {
  console.log("asdada");
  console.log("asdada");
}
