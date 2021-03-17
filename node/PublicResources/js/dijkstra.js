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
    queue.enqueue(element.name, element.distanceOrigin);
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

function traceback(backtrack, endNode) {}
