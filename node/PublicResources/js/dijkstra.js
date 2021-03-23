import { PriorityQueue } from "../js/queue.js";
import { initializeSingleSource, relax } from "../js/pathModules.js";

/**
 * Dijkstra's algorithm will find the shortest path between all nodes in a weighted graph.
 * @param {Object} graph The graph nodes will be updated with new distances
 * and parents in terms of the new starting point.
 * @param {Object} startNode The starting point node. Also called source.
 */
export function dijkstra(graph, startNode) {
  initializeSingleSource(graph, startNode);
  //let distances = new Object();
  let queue = new PriorityQueue();

  graph.nodes().forEach((element) => {
    queue.enqueue(element);
  });

  while (!queue.isEmpty()) {
    let shortestDistance = queue.dequeue();
    //distances.add(shortestDistance);
    // For-loop that checks if each edge's source is the observed node.
    graph.edges().forEach((edge) => {
      if (edge.source().id() === shortestDistance.id()) {
        let weight = graph
          .getElementById(`${shortestDistance.id()}${edge.target().id()}`)
          .data("length");
        relax(shortestDistance, edge.target(), weight);
      }
    });
  }
}
