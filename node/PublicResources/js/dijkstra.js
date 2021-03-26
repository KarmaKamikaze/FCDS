import { PriorityQueue } from "../js/queue.js";
import { initializeSingleSource, relax } from "../js/pathModules.js";

/**
 * Dijkstra's algorithm will find the shortest path between all nodes in a weighted graph.
 * @param {Object} cyGraph The graph nodes will be updated with new distances
 * and parents in terms of the new starting point.
 * @param {Object} startNode The starting point node. Also called source.
 */
export function dijkstra(cyGraph, startNode) {
  let graph = cyGraph.graph;
  initializeSingleSource(graph, startNode);
  let queue = new PriorityQueue();

  // Initialization
  queue.enqueue(startNode);

  while (!queue.isEmpty()) {
    let shortestDistance = queue.dequeue();
    let nodes = shortestDistance.openNeighborhood((ele) => ele.isNode()),
      n = nodes.length;

    // For loop that checks if node can traverse each edge
    for (let i = 0; i < n; i++) {
      let edge =
        shortestDistance.id().localeCompare(nodes[i].id()) == -1
          ? graph.$id(shortestDistance.id() + nodes[i].id())
          : graph.$id(nodes[i].id() + shortestDistance.id());

      /** Checks if the edge runs from node to target node, or if it is bidirectional
       * and can ignore going "against" the edge */
      if (edge.data("source") === nodes[i].id() || !edge.data("isOneWay")) {
        let weight = edge.data("length");
        let adjusted = relax(shortestDistance, nodes[i], weight);
        if (adjusted) {
          queue.enqueue(nodes[i]);
        }
      }
    }
  }
}
