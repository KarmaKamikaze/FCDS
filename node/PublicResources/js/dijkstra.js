// Initialize single source
// Relax
// Dijkstra
// Priority queue (increasing order) (min-heap)
// (Weight function)
import { PriorityQueue } from "./queue.js";
import { initializeSingleSource, relax } from "./pathModules.js";

/**
 *
 * @param {The graph nodes will be updated with new distances
 * and parents in terms of the new starting point.} graph
 * @param {The starting point node. Also called source.} startNode
 */
export function dijkstra(graph, startNode) {
  initializeSingleSource(graph, startNode);
  //let distances = new Object();
  let queue = new PriorityQueue();

  graph.nodes.forEach((element) => {
    queue.enqueue(element.id, element.distanceOrigin);
  });

  while (!queue.isEmpty) {
    let shortestDistance = queue.dequeue();
    //distances.add(shortestDistance);
    // For-loop that checks if each edge's source is the observed node.
    graph.edges.forEach((edge) => {
      if (edge.source() === shortestDistance.identifier) {
        relax(shortestDistance, edge.target());
      }
    });
  }
}

export function traceback(graph, endNode) {
  let shortestPath = "";
  let jump = endNode;

  while (jump.parent !== null && jump.distance !== 0) {
    shortestPath = jump.id() + " -> " + shortestPath;
    jump = graph.getElementById(`${jump.parent.identifier}`);
  }
  // Add the start node to the list.
  shortestPath = jump.id() + " -> " + shortestPath;
  // Test print
  // Change this function to animate the courier
  console.log(`Shortest path: ${shortestPath}`);
}
