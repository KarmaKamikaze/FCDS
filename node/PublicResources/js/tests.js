//Graph imports
import { TestCytoStyle } from "./cytoStylesheet.js";
import { Order, assignCourier } from "./orderGeneration.js";
//Traversal imports
import * as pathModules from "./pathModules.js";
import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { greedyBestFirstSearch } from "./greedyBestFirstSearch.js";

/* Since certain functions modify the values of nodes/edges in the graph,
 * the immutable test graph 'TEMPLATE' is used to reset the graph after
 * each test is executed. */
const TEMPLATE = new TestCytoStyle();
const UNREACHABLE = "Unreachable end node",
  START_NO_ADJ = "Start node with no adjacent nodes",
  VIABLE = "Viable path";

runAllTests();

/** Runs all application tests sequentially. */
function runAllTests() {
  let testGraph = TEMPLATE,
    results = null;

  results = testDijkstra(testGraph);
  console.info(`Dijkstra: Passed ${results.successes}/${results.total} tests.`);

  results = testAstar(testGraph);
  console.info(`A*: Passed ${results.successes}/${results.total} tests.`);

  results = testGreedyBestFirstSearch(testGraph);
  console.info(`BFS: Passed ${results.successes}/${results.total} tests.`);

  results = testOrderAssignment(testGraph);
  console.info(
    `Order assignment: Passed ${results.successes}/${results.total} tests.`
  );
}

/**
 * Runs all Dijkstra tests on the given graph.
 * @param testGraph The graph to perform tests on.
 */
function testDijkstra(testGraph) {
  let testResults = {
    successes: 0,
    total: 0,
  };

  //Test if Dijkstra reaches unreachable end node
  let test1 = {
    startId: "R1",
    endId: "N7",
    expected: ["R1"],
    msg: UNREACHABLE,
  };

  //Test if Dijkstra reaches end node from start node with no adjacent nodes
  let test2 = {
    startId: "N7",
    endId: "R1",
    expected: ["N7"],
    msg: START_NO_ADJ,
  };

  //Test if Dijkstra reaches end node from start node when a possible path exists with the expected path
  let test3 = {
    startId: "R1",
    endId: "C5",
    expected: ["R1", "N3", "N4", "C5"],
    msg: VIABLE,
  };

  let dijkstraTests = [test1, test2, test3];

  for (let i = 0; i < dijkstraTests.length; i++) {
    testGraph = TEMPLATE;
    if (testPathfinding(testGraph, dijkstra, dijkstraTests[i])) {
      testResults.successes++;
    }
    testResults.total++;
  }

  return testResults;
}

/**
 * Runs all A* tests on the given graph.
 * @param testGraph The graph to perform tests on.
 */
function testAstar(testGraph) {
  let testResults = {
    successes: 0,
    total: 0,
  };

  //Test if A* reaches unreachable end node
  let test1 = {
    startId: "R1",
    endId: "N7",
    expected: ["R1"],
    msg: UNREACHABLE,
  };

  //Test if A* reaches end node from start node with no adjacent nodes
  let test2 = {
    startId: "N7",
    endId: "R1",
    expected: ["N7"],
    msg: START_NO_ADJ,
  };

  //Test if A* reaches end node from start node when a possible path exists with the expected path
  let test3 = {
    startId: "R1",
    endId: "C5",
    expected: ["R1", "N3", "N4", "C5"],
    msg: VIABLE,
  };

  let aStarTests = [test1, test2, test3];

  for (let i = 0; i < aStarTests.length; i++) {
    testGraph = TEMPLATE;
    if (testPathfinding(testGraph, aStar, aStarTests[i])) {
      testResults.successes++;
    }
    testResults.total++;
  }

  return testResults;
}

/**
 * Runs all GreedyBFS tests on the given graph.
 * @param testGraph The graph to perform tests on.
 */
function testGreedyBestFirstSearch(testGraph) {
  let testResults = {
    successes: 0,
    total: 0,
  };

  //Test if BFS reaches unreachable end node
  let test1 = {
    startId: "R1",
    endId: "N7",
    expected: ["R1"],
    msg: UNREACHABLE,
  };

  //Test if BFS reaches end node from start node with no adjacent nodes
  let test2 = {
    startId: "N7",
    endId: "R1",
    expected: ["N7"],
    msg: START_NO_ADJ,
  };

  //Test if BFS reaches end node from start node when a possible path exists with the expected path
  let test3 = {
    startId: "R1",
    endId: "C5",
    expected: ["R1", "N2", "N3", "N4", "C5"],
    msg: VIABLE,
  };

  let BFSTests = [test1, test2, test3];

  for (let i = 0; i < BFSTests.length; i++) {
    testGraph = TEMPLATE;
    if (testPathfinding(testGraph, greedyBestFirstSearch, BFSTests[i])) {
      testResults.successes++;
    }
    testResults.total++;
  }
  return testResults;
}

/**
 * Tests the given shortest path algorithm with the given test data.
 * @param testGraph The graph to perform tests on.
 * @param pathFunc The shortest path algorithm to test.
 * @param testData The test data. I.e., startNode, endNode, expected result...
 */
function testPathfinding(testGraph, pathFunc, testData) {
  let actual = [];
  let startNode = testGraph.graph.getElementById(testData.startId);
  let endNode = testGraph.graph.getElementById(testData.endId);

  pathFunc(testGraph, startNode, endNode);
  actual = pathModules.traceback(testGraph.graph, startNode, endNode);

  let testStatus = assertArray(testData.expected, actual);
  console.assert(
    testStatus,
    `${pathFunc.name} - ${testData.msg} - Expected path: ${testData.expected} - Actual path: ${actual}`
  );
  return testStatus;
}

/**
 * Runs all order assignment tests on the given graph.
 * @param testGraph The graph to perform tests on.
 */
function testOrderAssignment(testGraph) {
  let testResults = {
    successes: 0,
    total: 0,
  };

  //Test when courier1 is closest to the restaurant
  let test1 = {
    originId: "R1",
    destId: "N4",
    c1Id: "N2",
    c2Id: "N3",
    expected: "courier1",
  };

  //Test when courier2 is closest to the restaurant
  let test2 = {
    originId: "R1",
    destId: "N4",
    c1Id: "N3",
    c2Id: "N2",
    expected: "courier2",
  };

  //Test when courier1 is unreachable
  let test3 = {
    originId: "R1",
    destId: "N4",
    c1Id: "N7",
    c2Id: "N2",
    expected: "courier2",
  };

  let assignCourierTests = [test1, test2, test3];
  for (let i = 0; i < assignCourierTests.length; i++) {
    if (testAssignCourier(testGraph, assignCourierTests[i])) {
      testResults.successes++;
    }
    testResults.total++;
  }

  return testResults;
}

/**
 * Tests the assignCourier function with the given test data.
 * @param testGraph The graph to perform tests on.
 * @param testData The test data. I.e., the order origin, courier positions...
 */
function testAssignCourier(testGraph, testData) {
  // Reset graph
  testGraph = TEMPLATE;
  testGraph.pathFunc = dijkstra;
  resetCouriers(testGraph);

  // Initialize the test
  let origin = testGraph.graph.$id(testData.originId),
    dest = testGraph.graph.$id(testData.destId);

  let order = new Order("test", origin, dest, 1);
  testGraph.orders.push(order);

  testGraph.addCourier(testData.c1Id);
  testGraph.addCourier(testData.c2Id);

  // Perform the actual assignment test
  assignCourier(testGraph, order, 0);

  let actual = order.assignedCourier;

  let testStatus = actual === testData.expected;
  console.assert(
    testStatus,
    `assignCourier - Expected: ${testData.expected} - Actual: ${actual}`
  );

  return testStatus;
}

/**
 * Ensures that all courier data is deleted in the input graph
 * @param testGraph The test graph to reset.
 */
function resetCouriers(testGraph) {
  for (let courier of testGraph.couriers) {
    testGraph.delNode(courier.id());
  }
  testGraph.couriers = new Array();
  testGraph.courierCount = 0;
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
