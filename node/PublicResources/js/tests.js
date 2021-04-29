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

//Integration tests

//Unit test

function runAllTests() {}

runAllTests();
