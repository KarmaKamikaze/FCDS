import { PriorityQueue } from "../js/queue.js";
import { initializeSingleSource, relax } from "../js/pathModules.js";

/**
 * Dijkstra's algorithm will find the shortest path between all nodes in a weighted graph.
 * @param {Class} cyGraph The graph nodes will be updated with new distances
 * and parents in terms of the new starting point.
 * @param {Object} startNode The starting point node. Also called source.
 */
function dijkstra(cyGraph, startNode) {
  let graph = cyGraph.graph;
  initializeSingleSource(graph, startNode);
  let queue = new PriorityQueue();

  // Initialization
  queue.enqueue(startNode);

  while (!queue.isEmpty()) {
    let shortestDistance = queue.dequeue();
    let nodes = shortestDistance.openNeighborhood((ele) => ele.isNode());

    // For loop that checks if node can traverse each edge
    for (let i = 0; i < nodes.length; i++) {
      let edge = graph.getElementById(
        `${shortestDistance.id()}${nodes[i].id()}`
      );
      let weight = edge.data("weight");
      let adjusted = relax(shortestDistance, nodes[i], weight);
      if (adjusted) {
        queue.enqueue(nodes[i]);
      }
    }
  }
}

export { dijkstra };
