//Graph imports
import { CytoStyle, TestCytoStyle } from "./cytoStylesheet.js";
import { generateHeatmap } from "./heatGeneration.js";
//Traversal imports
import * as pathModules from "../js/pathModules.js";
import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { greedyBestFirstSearch } from "./greedyBestFirstSearch.js";

/* Since certain functions modify the values of nodes/edges in the graph,
 * the immutable test graph 'template' is used to reset the graph after
 * each test is executed. */
const template = new TestCytoStyle();

runAllTests();

function runAllTests() {
  let testGraph = template;

  testDijkstra(testGraph);
  testAstar(testGraph);
  testGreedyBestFirstSearch(testGraph);
}

/**
 * Asserts that all values in the 'actual' array match the ones in the 'expected' array.
 * @param {Array} expected Array of expected values
 * @param {Array} actual Array of actual values
 * @returns True if all values match and are in order, and false otherwise.
 */
function assertArray(expected, actual) {
  if (expected.length !== actual.length) {
    return false;
  }
  for (let i = 0; i < expected.length; i++) {
    if (expected[i] !== actual[i]) {
      return false;
    }
  }
  return true;
}

//Test behavior for Dijkstra
function testDijkstra(testGraph) {
  let startNode = null,
    endNode = null,
    expected = null,
    actual = null;

  //Test if Dijkstra reaches unreachable end node
  testGraph = template;
  startNode = testGraph.graph.$id(`R1`);
  endNode = testGraph.graph.$id(`N7`);

  dijkstra(testGraph, startNode);
  expected = ["R1"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);

  console.assert(
    assertArray(expected, actual),
    `Dijkstra unreachable end node - Expected path: ${expected} - Actual path: ${actual}`
  );

  //Test if Dijkstra reaches end node from start node with no adjacent nodes
  testGraph = template;
  startNode = testGraph.graph.getElementById(`N7`);
  endNode = testGraph.graph.getElementById(`R1`);

  dijkstra(testGraph, startNode);
  expected = ["N7"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);
  console.assert(
    assertArray(expected, actual),
    `Dijkstra - start node with no adjacent nodes - Expected path: ${expected} - Actual path: ${actual}`
  );

  //Test if Dijkstra reaches end node from start node when a possible path exists with the expectd path
  testGraph = template;
  startNode = testGraph.graph.getElementById(`R1`);
  endNode = testGraph.graph.getElementById(`C5`);

  dijkstra(testGraph, startNode);
  expected = ["R1", "N3", "N4", "C5"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);
  console.assert(
    assertArray(expected, actual),
    `Dijkstra - viable path - Expected path: ${expected} - Actual path: ${actual}`
  );
}

//Test behavior for A*
function testAstar(testGraph) {
  let startNode = null,
    endNode = null,
    expected = null,
    actual = null;

  //Test if A* reaches unreachable end node
  testGraph = template;
  startNode = testGraph.graph.getElementById(`R1`);
  endNode = testGraph.graph.getElementById(`N7`);

  aStar(testGraph, startNode, endNode);
  expected = ["R1"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);
  console.assert(
    assertArray(expected, actual),
    `A* - unreachable end node - Expected path: ${expected} - Actual path: ${actual}`
  );

  //Test if A* reaches end node from start node with no adjacent nodes
  testGraph = template;
  startNode = testGraph.graph.getElementById(`N7`);
  endNode = testGraph.graph.getElementById(`R1`);

  aStar(testGraph, startNode, endNode);
  expected = ["N7"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);
  console.assert(
    assertArray(expected, actual),
    `A* - start node with no adjacent nodes - Expected path: ${expected} - Actual path: ${actual}`
  );

  //Test if A* reaches end node from start node when a possible path exists with the expectd path
  testGraph = template;
  startNode = testGraph.graph.getElementById(`R1`);
  endNode = testGraph.graph.getElementById(`C5`);

  aStar(testGraph, startNode, endNode);
  expected = ["R1", "N3", "N4", "C5"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);
  console.assert(
    assertArray(expected, actual),
    `A* - viable path - Expected path: ${expected} - Actual path: ${actual}`
  );
}

//Test behavior for greedyBFS
function testGreedyBestFirstSearch(testGraph) {
  let startNode = null,
    endNode = null,
    expected = null,
    actual = null;

  //Test if greedyBFS reaches unreachable end node
  testGraph = template;
  startNode = testGraph.graph.getElementById(`R1`);
  endNode = testGraph.graph.getElementById(`N7`);

  greedyBestFirstSearch(testGraph, startNode, endNode);
  expected = ["R1"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);
  console.assert(
    assertArray(expected, actual),
    `greedyBFS - unreachable end node - Expected path: ${expected} - Actual path: ${actual}`
  );

  //Test if greedyBFS reaches end node from start node with no adjacent nodes
  testGraph = template;

  startNode = testGraph.graph.getElementById(`N7`);
  endNode = testGraph.graph.getElementById(`R1`);

  greedyBestFirstSearch(testGraph, startNode, endNode);
  expected = ["N7"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);
  console.assert(
    assertArray(expected, actual),
    `greedyBFS - start node with no adjacent nodes - Expected path: ${expected} - Actual path: ${actual}`
  );

  //Test if greedyBFS reaches end node from start node when a possible path exists with the expected path
  testGraph = template;
  startNode = testGraph.graph.getElementById(`R1`);
  endNode = testGraph.graph.getElementById(`C5`);

  greedyBestFirstSearch(testGraph, startNode, endNode);
  expected = ["R1", "N2", "N3", "N4", "C5"];
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);
  console.assert(
    assertArray(expected, actual),
    `greedyBFS - viable path - Expected path: ${expected} - Actual path: ${actual}`
  );
}
