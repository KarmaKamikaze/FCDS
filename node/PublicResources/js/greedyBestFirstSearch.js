import { PriorityQueue } from "./queue.js";
import { heuristicApprox } from "./pathModules.js";

/**
 * Finds shortest route between start node and end node by greedy search with a heuristic helper function.
 * Done by assigning distanceOrigin property and parent property to nodes.
 * This allows for the traceback function to be called, creating the shortest path.
 * @param {Object} graph The cytoscape graph object, containing all information
 * for each node and edge in the network.
 * @param {Object} startNode The starting position node from which we would like to travel.
 * A courier's location usually determines where to begin the journey.
 * @param {Object} endNode The end goal node, which is the destination of the journey.
 */
function greedyBestFirstSearch(cyGraph, startNode, endNode) {
  let pending = new PriorityQueue(); // Open list of nodes not yet checked. Prioritized by shortest straight line distance (SLD) to end node.
  let fullyExpanded = new Set(); // Closed list of nodes already checked.
  let currentShortest = {}; // The minimum SLD element from the priority queue.

  // Initialization
  startNode.data("_parent", null);
  startNode.data(
    "distanceOrigin",
    heuristicApprox(cyGraph, startNode.id(), endNode.id())
  );
  pending.enqueue(startNode);

  // While-loop runs until the queue is empty OR until we have reached the endNode.
  while (!pending.isEmpty()) {
    currentShortest = pending.dequeue();
    // We have reached our destination; stop looking.
    if (currentShortest === endNode) {
      break;
    }
    // Add current node being analyzed to closed list.
    fullyExpanded.add(currentShortest);

    //loop that manages the queue for the successors of the currently observed node utilizing neighborhood method.
    currentShortest.closedNeighborhood((ele) => {
      if (ele.isEdge()) {
        if (ele.target() != currentShortest) {
          let adjacentNode = ele.target();
          // If the successor is in the closed list, do not add it to open list, continue to next adjacent node.
          if (fullyExpanded.has(adjacentNode)) {
            return;
          }

          // If adjacent node is end node set it's parent node to this node, stop searching adjacent nodes and add it to top of queue to stop search.
          else if (adjacentNode === endNode) {
            adjacentNode.data("_parent", currentShortest.id());
            adjacentNode.data("distanceOrigin", 1); //To avoid problems where checks are made if 'distanceOrigin' is set to 0, to determine whether 'distanceOrigin' has been set yet.
            pending.enqueue(adjacentNode);
            return;
          } else {
            // Calculate SLD for adjacent node.
            adjacentNode.data(
              "distanceOrigin",
              heuristicApprox(cyGraph, adjacentNode.id(), endNode.id())
            );
            // Set parent node to current node and add adjacent node to the open queue.
            adjacentNode.data("_parent", currentShortest.id());
            pending.enqueue(adjacentNode);
            return;
          }
        }
      }
    });
  }
  /*if (currentShortest.id() !== endNode.id()) {
    throw new Error("BFS error: Open list is empty. Path could not be found!");
  }*/
}

export { greedyBestFirstSearch };
