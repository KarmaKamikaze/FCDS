// Initialize single source
// Relax
// Dijkstra
// Priority queue (increasing order) (min-heap)
// (Weight function)
import { PriorityQueue } from "./queue.js";

function initializeSingleSource(graph, startNode) {
  // Change identifier after cytoscape is implemented
  graph.forEach((element) => {
    element.node.distance = Infinity;
    element.node.parent = null;
  });
  startNode.node.distance = 0;
}

export function dijkstra(graph, startNode) {
  initializeSingleSource(graph, startNode);
  let distances = new Set();
  let queue = new PriorityQueue();

  graph.forEach((element) => {
    queue.enqueue(element.node.name, element.node.distance);
  });

  while (!queue.isEmpty) {
    let shortestDistance = queue.dequeue();
    distances.add(shortestDistance);
  }
}
