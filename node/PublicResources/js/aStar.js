// A*
// Heuristic
//
import { PriorityQueue } from "../js/queue.js";
import { heuristicApprox } from "../js/pathModules.js";

export function aStar(graph, startNode, endNode) {
  let pending = new PriorityQueue(); // Open list
  let fullyExpanded = new Set(); // Close list
  let currentShortest = {};

  // Initialization
  startNode.data(
    "distanceOrigin",
    heuristicApprox(startNode.id(), endNode.id())
  );
  startNode.data("_parent", null);
  pending.enqueue(startNode);

  while (!pending.isEmpty()) {
    currentShortest = pending.dequeue();

    // We have reached our destination; stop looking.
    if (currentShortest.id() === endNode.id()) {
      break;
    }

    graph.edges().forEach((edge) => {
      if (edge.source().id() === currentShortest.id()) {
        let successor = edge.target();
        let weight = edge.data("length");
        let possibleImprovedCost =
          currentShortest.data("distanceOrigin") + weight;

        if (pending.nodes.includes(successor)) {
          /** If the new possibleImprovedCost is less efficient than the existing cost,
           *  we do not apply it and return */
          if (successor.data("distanceOrigin") <= possibleImprovedCost) {
            return;
          }
        } else if (fullyExpanded.has(successor)) {
          if (successor.data("distanceOrigin") <= possibleImprovedCost) {
            return;
          }
          pending.enqueue(successor);
          fullyExpanded.delete(successor);
        } else {
          pending.enqueue(successor);
        }
        successor.data(
          "distanceOrigin",
          possibleImprovedCost + heuristicApprox(successor.id(), endNode.id())
        );
        successor.data("_parent", currentShortest.id());
      }
    });
    fullyExpanded.add(currentShortest);
  }

  if (currentShortest.id() !== endNode.id()) {
    throw new Error("A* error: Open list is empty. Path could not be found!");
  }
}
