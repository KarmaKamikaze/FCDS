/**
 * All nodes are initialized by setting their distance to
 * the origin/source to infinity and setting their parents to null.
 * @param {Object} graph The graph which will be initialized and reset: The starting point will be set to 0,
 * while every other node will have a distance of Infinity. All parents will be zero.
 * @param {Object} startNode The source node/origin point.
 */
function initializeSingleSource(graph, startNode) {
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
 * @returns A boolean that confirms if the newWeight was adjusted or not.
 */
function relax(currentNode, adjacentNode, weight) {
  let newWeight = currentNode.data("distanceOrigin") + weight;
  if (adjacentNode.data("distanceOrigin") > newWeight) {
    /** The distance from the source to the adjacent node is updated through addition
     * of the source's distance to the current node
     * and the weight between the current node and the adjacent node */
    adjacentNode.data("distanceOrigin", newWeight);
    /** The parent will retain the path back to the starting points,
     * if combined with all other parents. */
    adjacentNode.data("_parent", currentNode.id());
    return true;
  }
  return false;
}

/**
 * Approximates the direct distance from the current node being observed
 * @param {Object} currentNodeId The current node we are evaluating in respect to the end goal.
 * @param {Object} endNodeId The end goal node.
 * @returns The Pythagorean distance between the currentNodeId and the endNodeId.
 */
function heuristicApprox(cyGraph, currentNodeId, endNodeId) {
  let currentPos = cyGraph.getPos(currentNodeId);
  let endPos = cyGraph.getPos(endNodeId);
  let [currentX, currentY] = [currentPos.x, currentPos.y];
  let [endX, endY] = [endPos.x, endPos.y];
  return Math.sqrt(Math.pow(currentX - endX, 2) + Math.pow(currentY - endY, 2));
}

/**
 * Traces back the route found by a shortest path algorithm, in this case either
 * Dijkstra or A*. It uses the graph, which contains nodes with parent properties,
 * and walks fra the endNode and backwards toward the starting point.
 * @param {Object} graph The graph which contains distances and parents,
 * which we will use for navigation.
 * @param {Object} endNode The end goal for which we want to find the shortest path.
 */
function traceback(graph, startNode, endNode) {
  let jump = endNode;
  let path = new Array();

  /** While-loop that reiterates through the parents of jump,
   * creating a list of nodes used to go from start node to end node. */
  while (jump.data("_parent") !== null && jump.data("distanceOrigin") !== 0) {
    path.unshift(jump.id());
    jump = graph.getElementById(`${jump.data("_parent")}`);
  }
  // Add the start node to the list.
  path.unshift(startNode.id());

  return path;
}

export { initializeSingleSource, relax, heuristicApprox, traceback };
