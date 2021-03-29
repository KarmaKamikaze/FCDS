import { PriorityQueue } from "../js/queue.js";
import { heuristicApprox } from "../js/pathModules.js";

/**
 * This functions changes the network elements. The nodes have their distanceOrigin
 * property and their parent property assigned. This allows for the traceback
 * function to be called, creating the shortest path.
 * @param {Object} graph The cytoscape graph object, containing all information
 * for each node and edge in the network.
 * @param {Object} startNode The starting position node from which we would like to travel.
 * A courier's location usually determines where to begin the journey.
 * @param {Object} endNode The end goal node, which is the destination of the journey.
 */
function aStar(cyGraph, startNode, endNode) {
  let pending = new PriorityQueue(); // Open list
  let fullyExpanded = new Set(); // Close list
  let currentShortest = {}; // The minimum distance element from the priority queue.
  // Initialization
  startNode.data(
    "distanceOrigin",
    heuristicApprox(cyGraph, startNode.id(), endNode.id())
  );
  startNode.data("_parent", null);
  pending.enqueue(startNode);

  // While-loop runs until the queue is empty OR until we have reached the endNode.
  while (!pending.isEmpty()) {
    currentShortest = pending.dequeue();

    // We have reached our destination; stop looking.
    if (currentShortest === endNode) {
      break;
    }

    // forEach loop that manages the queue for the successors of the currently observed node.
    cyGraph.graph.edges().forEach((edge) => {
      if (edge.target().id === currentShortest.id() && !edge.data("isOneWay")) {
        console.warn(`Traversing one-way edge!`);
        return;
      } else if (edge.source().id() === currentShortest.id()) {
        let successor = edge.target();
        let weight = edge.data("length");
        /** possibleImprovedCost is a variable used to describe the possible improvement
         * on the value residing in successor.data("distanceOrigin"), which is based on
         * earlier iterations of the forEach loop */
        let possibleImprovedCost =
          currentShortest.data("distanceOrigin") + weight;

        // If the successor is in the open list:
        if (pending.nodes.includes(successor)) {
          /** If the new possibleImprovedCost is less efficient than the existing cost,
           *  we do not apply it and return */
          if (successor.data("distanceOrigin") <= possibleImprovedCost) {
            return;
          }
        }
        // If the successor is in the closed list, but possibly needs reassessment:
        else if (fullyExpanded.has(successor)) {
          if (successor.data("distanceOrigin") <= possibleImprovedCost) {
            return;
          }
          pending.enqueue(successor);
          fullyExpanded.delete(successor);
        }
        // Otherwise the successor has not yet been enqueued; enqueue it:
        else {
          pending.enqueue(successor);
        }
        /** This code only runs if possibleImprovedCost is larger than the current cost.
         * Updates the successor's cost using possibleImprovedCost and the heuristic
         * approximation. Also assigns the parent of the successor. */
        successor.data(
          "distanceOrigin",
          possibleImprovedCost +
          heuristicApprox(cyGraph, successor.id(), endNode.id())
        );
        successor.data("_parent", currentShortest.id());
      }
    });
    /** When we are finished with a parent node and all successors has been enqueued,
     *  the parent node is added to the closed list. */
    fullyExpanded.add(currentShortest);
  }

  if (currentShortest.id() !== endNode.id()) {
    throw new Error("A* error: Open list is empty. Path could not be found!");
  }
}

export { aStar };
