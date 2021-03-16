// Initialize single source
// Relax
// Dijkstra
// Priority queue (increasing order) (min-heap)
// (Weight function)
import PriorityQueue from "queues.js";

function initializeSingleSource(graph, startNode) {
  // Change identifier after cytoscape is implemented
  graph.forEach((element) => {
    element.node.distance = Infinity;
    element.node.parent = null;
  });
  startNode.distance = 0;
}

function dijkstra(graph, startNode) {
  initializeSingleSource(graph, startNode);
  let distances = new Set();
}
