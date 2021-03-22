import { PriorityQueue } from "./queue.js";
import { initializeSingleSource, relax } from "./pathModules.js";

/**
 * Dijkstra's algorithm will find the shortest path between all nodes in a weighted graph.
 * @param {The graph nodes will be updated with new distances
 * and parents in terms of the new starting point.} graph
 * @param {The starting point node. Also called source.} startNode
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
        let weight = graph.getElementById(
          `${shortestDistance.id()}${edge.target().id()}`
        ).data("length");
        relax(shortestDistance, edge.target(), weight);
      }
    });
  }
}

/**
 *
 * @param {The graph which contains distances and parents,
 * which we will use for navigation.} graph
 * @param {The end goal for which we want to find the shortest path.} endNode
 */
export function traceback(graph, endNode) {
  let shortestPath = "";
  let jump = endNode;
  let path = new Array;

  /**
   * While-loop that reiterates through the parents of jump,
   * creating a list of nodes used to go from start node to end node.
   */
  while (jump.data("_parent") !== null && jump.data("distanceOrigin") !== 0) {
    if (shortestPath === "") {
      shortestPath = jump.id();
    } else {
      shortestPath = jump.id() + " -> " + shortestPath;
    }
    path.unshift(jump.id());
    jump = graph.getElementById(`${jump.data("_parent")}`);
  }
  // Add the start node to the list.
  shortestPath = jump.id() + " -> " + shortestPath;
  path.unshift(jump.id())
  // Test print
  // Change this function to animate the courier
  console.log(`Shortest path: ${shortestPath}`);
  return path;
}
