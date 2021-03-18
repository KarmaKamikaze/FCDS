const maxSpeedLimit = 130;

/**
 * All nodes are initialized by setting their distance to
 * the origin/source to infinity and setting their parents to null.
 * @param {The graph which will be initialized and reset: The starting point will be set to 0,
 * while every other node will have a distance of Infinity. All parents will be zero.} graph
 * @param {The source node/origin point.} startNode
 */
export function initializeSingleSource(graph, startNode) {
  // Change identifier after Cytoscape is implemented
  graph.nodes.forEach((element) => {
    element.distanceOrigin = Infinity;
    element.parent = null;
  });
  // The startNode's distance to itself is assigned to 0
  startNode.nodes.distanceOrigin = 0;
}

/**
 * The relax function assigns the appropriate distance and parent to adjacent nodes of the current nodes.
 * @param {The current node being observed, which adjacentNode is adjacent to} currentNode
 * @param {A node adjacent to currentNode.
 * This node is the target of an edge, which has the source of currentNode} adjacentNode
 * @param {The weight associated with the edge between currentNode and adjacentNode.} weight
 */
export function relax(currentNode, adjacentNode, weight) {
  if (adjacentNode.distance > currentNode.distance + weight) {
    /* The distance from the source to the adjacent node is updated through addition
     * of the source's distance to the current node
     * and the weight between the current node and the adjacent node */
    adjacentNode.distance = currentNode.distance + weight;
    /* The parent will retain the path back to the starting points,
     * if combined with all other parents. */
    adjacentNode.parent = currentNode;
  }
}

/**
 * Gives an edge a weight by calculating its property and assigning to weight property
 * @param {The object for the courier en route} courierObject
 * @param {The edge whose weight is being calculated} edgeObject
 */
export function calculateWeight(edgeObject, courierObject) {
  edgeObject.weight =
    edgeObject.distance *
    (maxSpeedLimit / edgeObject.speedLimit) *
    edgeObject.permObstructions; // * (edge.tempObstructions) <- multiply onto when taking traffic and temporary obstructions into account.
  console.log(edgeObject.weight);
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
