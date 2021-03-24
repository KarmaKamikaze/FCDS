import { CyGraph } from "../js/graphHelper.js";

const maxSpeedLimit = 130;

/**
 * All nodes are initialized by setting their distance to
 * the origin/source to infinity and setting their parents to null.
 * @param {Object} graph The graph which will be initialized and reset: The starting point will be set to 0,
 * while every other node will have a distance of Infinity. All parents will be zero.
 * @param {Object} startNode The source node/origin point.
 */
export function initializeSingleSource(graph, startNode) {
  // Change identifier after Cytoscape is implemented
  graph.nodes().forEach((element) => {
    element.data("distanceOrigin", Infinity);
    element.data("_parent", null);
  });
  // The startNode's distance to itself is assigned to 0
  startNode.data("distanceOrigin", 0);
}

/**
 * The relax function assigns the appropriate distance and parent to adjacent nodes of the current nodes.
 * @param {Object} currentNode The current node being observed, which adjacentNode is adjacent to
 * @param {Object} adjacentNode A node adjacent to currentNode.
 * This node is the target of an edge, which has the source of currentNode
 * @param {Number} weight The weight associated with the edge between currentNode and adjacentNode.
 */
export function relax(currentNode, adjacentNode, weight) {
  if (
    adjacentNode.data("distanceOrigin") >
    currentNode.data("distanceOrigin") + weight
  ) {
    let tempWeight = currentNode.data("distanceOrigin") + weight;
    /** The distance from the source to the adjacent node is updated through addition
     * of the source's distance to the current node
     * and the weight between the current node and the adjacent node */
    adjacentNode.data("distanceOrigin", tempWeight);
    /** The parent will retain the path back to the starting points,
     * if combined with all other parents. */
    adjacentNode.data("_parent", currentNode.id());
  }
}

/**
 * Approximates the direct distance from the current node being observed
 * @param {Object} currentNodeId The current node we are evaluating in respect to the end goal.
 * @param {Object} endNodeId The end goal node.
 * @returns The Pythagorean distance between the currentNodeId and the endNodeId.
 */
export function heuristicApprox(currentNodeId, endNodeId) {
  let currentPos = CyGraph.getPos(currentNodeId);
  let endPos = CyGraph.getPos(endNodeId);
  let [currentX, currentY] = [currentPos.x, currentPos.y];
  let [endX, endY] = [endPos.x, endPos.y];

  return Math.sqrt(Math.pow(currentX - endX, 2) + Math.pow(currentY - endY, 2));
}

/**
 * Gives an edge a weight by calculating its property and assigning to weight property
 * @param {Object} courierObject The object for the courier en route
 * @param {Object} edgeObject The edge whose weight is being calculated
 */
export function calculateWeight(edgeObject, courierObject) {
  edgeObject.weight =
    edgeObject.distance *
    (maxSpeedLimit / edgeObject.speedLimit) *
    edgeObject.permObstructions; // * (edge.tempObstructions) <- multiply onto when taking traffic and temporary obstructions into account.
  console.log(edgeObject.weight);
}

/**
 *
 * @param {Object} graph The graph which contains distances and parents,
 * which we will use for navigation.
 * @param {Object} endNode The end goal for which we want to find the shortest path.
 */
export function traceback(graph, endNode) {
  let shortestPath = "";
  let jump = endNode;
  let path = new Array();

  /** While-loop that reiterates through the parents of jump,
   * creating a list of nodes used to go from start node to end node. */
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
  path.unshift(jump.id());

  console.log(`Shortest path: ${shortestPath}`); // Test print
  return path;
}

//Test area below

/* Generates random value for determining traffic and temporary obstructions. Not yet implemented.
const randomNumber = (max) => (Math.floor(Math.random() * max));
*/

/**
 * Not implemented yet. Needs to calculate factor for temporary obstructions: traffic and road work, etc.
 */
/* function tempSlowdown() {
 let obstructions;
 let maxTraffic = 60; //navn?
 let maxObstruction = 10;
 let traffic = randomNumber(max);

 if (randomNumber(10) === 9) {
   obstructions = 20;
 }

 if (traffic + obstructions > maxTraffic) {
   return maxTraffic;
 } else {
   return (traffic + obstructions);
 }
} */

//Placeholder for edge
/* 
let edge = {
  distance: 100,
  speedLimit: 50,
  permObstructions: 60,
  weight: 1,
};

//Placeholder for courier
let courier = 2;
  edgesArray = [edge];
*/

/*
//Testing function
 edgesArray.forEach(edge => {
   weightingFunction(courier, edge); 
 });
 */

//Placeholder for edge
/*
let edge = {
    distance: 1000,
    speed_limit: 50,
    perm_obstructions: 1,
    temp_obstructions: tempObstructions(),
    traffic: trafficGeneration(),
    weight: () => (edges.distance *(130 / edges.speedLimit) * edges.traffic * edges.obstructions * edges.intersection);
  }
  */
