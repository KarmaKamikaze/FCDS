import { PriorityQueue } from "./queue.js";
import { heuristicApprox } from "../js/pathModules.js";
/* --Todo--
 * traceback
 * 2 empty lists "open" and "closed"
 *
 */

/*
 * 1. Create 2 empty lists: OPEN and CLOSED
 * 2. Start from the initial node (say N) and put it in the ‘ordered’ OPEN list
 * 3. Repeat the next steps until GOAL node is reached
 *   1. If OPEN list is empty, then EXIT the loop returning ‘False’
 *   2. Select the first/top node (say N) in the OPEN list and move it to the CLOSED list. Also capture the information of the parent node
 *   3. If N is a GOAL node, then move the node to the Closed list and exit the loop returning ‘True’. The solution can be found by backtracking the path
 *   4. If N is not the GOAL node, expand node N to generate the ‘immediate’ next nodes linked to node N and add all those to the OPEN list
 *   5. Reorder the nodes in the OPEN list in ascending order according to an evaluation function f(n)
 */

/* Heuristic function*/
/*enqueue + dequeue */
/* */

function bestFirstSearch(cyGraph, startNode, endNode) {
  console.log("BFS running...");
  let openQueue = new PriorityQueue();
  let closedQueue = new Set(); // Close list
  let currentNode = {}; // The minimum distance element from the open queue.
  let adjacentNode = {};

  startNode.data(
    "distanceOrigin1",
    heuristicApprox(cyGraph, startNode.id(), endNode.id())
  );
  startNode.data("_parent", null);

  openQueue.enqueue(startNode);
  
  // While-loop runs until the queue is empty OR until we have reached the endNode.
  while (!openQueue.isEmpty()) {
    currentNode = openQueue.dequeue();
    console.log(currentNode.id());

    // We have reached our destination; stop looking.
    if (currentNode === endNode) {
      break;
    }

    //Put adjacent nodes into openQueue
    currentNode.neighborhood((adjacentNodeAndEdges) => {
    if (adjacentNodeAndEdges.isNode()) {
      adjacentNode = adjacentNodeAndEdges;
      if (closedQueue.has(adjacentNode)) {
        return;
      }
      adjacentNode.data(
      "distanceOrigin1",
      heuristicApprox(cyGraph, adjacentNode.id(), endNode.id())
      );

    /** This code only runs if possibleImprovedCost is larger than the current cost.
     * Updates the successor's cost using possibleImprovedCost and the heuristic
     * approximation. Also assigns the parent of the successor. */
    adjacentNode.data(
      "distanceOrigin1",
      heuristicApprox(cyGraph, adjacentNode.id(), endNode.id())
    );
    openQueue.enqueue(adjacentNode);

    adjacentNode.data("_parent", currentNode.id());
    closedQueue.add(currentNode);
    
    openQueue.enqueue(adjacentNode);
    }
    });

  }
  if (currentNode.id() !== endNode.id()) {
    throw new Error("A* error: Open list is empty. Path could not be found!");
  }
  console.log("BFS ending...");
}


// If the successor is in the open list:
// if (openQueue.nodes.includes(adjacentNode)) {
  /** If the new possibleImprovedCost is less efficient than the existing cost,
   *  we do not apply it and return */
/*    if (adjacentNode.data("distanceOrigin1") <= possibleImprovedCost) {
      return;
    }
  }

  // If the successor is in the closed list, but possibly needs reassessment:
  else if (closedQueue.has(adjacentNode)) {
    if (adjacentNode.data("distanceOrigin1") <= possibleImprovedCost) {
      return;
    }
    openQueue.enqueue(adjacentNode);
    closedQueue.delete(adjacentNode);
  }

// Otherwise the successor has not yet been enqueued; enqueue it:
else {
  openQueue.enqueue(adjacentNode);
} */

export { bestFirstSearch };