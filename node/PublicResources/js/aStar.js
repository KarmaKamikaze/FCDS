// A*
// Heuristic
//
import { PriorityQueue } from "../js/queue.js";
import { getPos } from "../js/cytoNetwork";

export function aStar(graph, startNode, endNode) {
  let pending = new PriorityQueue();
  let path = new Array();

  // Initialization
  startNode.data("distanceOrigin", heuristicApprox(startNode, endNode));
  pending.enqueue(startNode);
}

function heuristicApprox(currentNode, endNode) {
  let currentX = getPos(currentNode).x;
  let currentY = getPos(currentNode).y;
  let endX = getPos(endNode).x;
  let endY = getPos(endNode).y;

  return Math.sqrt(Math.pow(currentX - endX, 2) + Math.pow(currentY - endY, 2));
}

function combineMoveCost(heuristic, weight) {
  return heuristic + weight;
}
