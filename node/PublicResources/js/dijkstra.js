import { PriorityQueue } from "./queue.js";
import { initializeSingleSource, relax } from "./pathModules.js";
// IMPORT CYTOSCOPE

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
    queue.enqueue(element.id(), element.distanceOrigin);
  });

  while (!queue.isEmpty) {
    let shortestDistance = queue.dequeue();
    //distances.add(shortestDistance);
    // For-loop that checks if each edge's source is the observed node.
    graph.edges.forEach((edge) => {
      if (edge.source() === shortestDistance.identifier) {
        let weight = graph.getElementById(
          `${shortestDistance.identifier}${edge.target().id()}`
        ).weight;
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

  /* While-loop that reiterates through the parents of jump,
   * creating a list of nodes used to go from startnode to endnode. */
  while (jump.parent !== null && jump.distance !== 0) {
    if (shortestPath === "") {
      shortestPath = jump.id();
    } else {
      shortestPath = jump.id() + " -> " + shortestPath;
    }
    jump = graph.getElementById(`${jump.parent.identifier}`);
  }
  // Add the start node to the list.
  shortestPath = jump.id() + " -> " + shortestPath;
  // Test print
  // Change this function to animate the courier
  console.log(`Shortest path: ${shortestPath}`);
}