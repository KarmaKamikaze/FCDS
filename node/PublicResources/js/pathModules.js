/**
 *
 * @param {The graph which will be initialized and reset: The starting point will be set to 0,
 * while every other node will have a distance of Infinity. All parents will be zero.} graph
 * @param {The source node/origin point.} startNode
 */
export function initializeSingleSource(graph, startNode) {
  // Change identifier after cytoscape is implemented
  /* All nodes are initialized by setting their distance to
   * the origin/source to infinity and setting their parents to null. */
  graph.nodes.forEach((element) => {
    element.distanceOrigin = Infinity;
    element.parent = null;
  });
  // The startnode's distance to itself is assigned to 0
  startNode.nodes.distanceOrigin = 0;
}

/**
 *
 * @param {The current node being observed, which adjacentnode is adjecent to} currentNode
 * @param {A node adjacent to currentnode.
 * This node is the target of an edge, which has the source of currentnode} adjacentNode
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
