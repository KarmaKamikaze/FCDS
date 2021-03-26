import { PriorityQueue } from "../js/queue.js";
import { initializeSingleSource, relax } from "../js/pathModules.js";

/**
 * Dijkstra's algorithm will find the shortest path between all nodes in a weighted graph.
 * @param {Object} cyGraph The graph nodes will be updated with new distances
 * and parents in terms of the new starting point.
 * @param {Object} startNode The starting point node. Also called source.
 */
export function dijkstra(cyGraph, startNode, initSrc = true) {
  let graph = cyGraph.graph;
  if (initSrc) {
    initializeSingleSource(graph, startNode);
  }
  let queue = new PriorityQueue();

  graph.nodes().forEach((element) => {
    queue.enqueue(element);
  });

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

      if (edge.data("target") !== nodes[i].id() && edge.data("isOneWay")) {
        continue;
      } else {
        let weight = edge.data("length");
        relax(shortestDistance, nodes[i], weight);
      }
    }
  }
  if (initSrc) {
    dijkstra(cyGraph, startNode, false);
  }
}
