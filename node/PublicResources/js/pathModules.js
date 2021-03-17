export function initializeSingleSource(graph, startNode) {
  // Change identifier after cytoscape is implemented
  graph.nodes.forEach((element) => {
    element.distanceOrigin = Infinity;
    element.parent = null;
  });
  startNode.nodes.distanceOrigin = 0;
}

/**
 *
 * @param {The current node being observed, which adjacentnode is adjecent to} currentNode
 * @param {A node adjacent to currentnode.
 * This node is the target of an edge, which has the source of currentnode} adjacentNode
 */
export function relax(currentNode, adjacentNode) {
  if (
    adjacentNode.distance >
    currentNode.distance + weight(currentNode, adjacentNode)
  ) {
    /* The distance from the source to the adjacent node is updated through addition
     * of the source's distance to the current node
     * and the weight between the current node and the adjacent node */
    adjacentNode.distance =
      currentNode.distance + weight(currentNode, adjacentNode);
    /* The parent will retain the path back to the starting points,
     * if combined with all other parents. */
    adjacentNode.parent = currentNode;
  }
}
