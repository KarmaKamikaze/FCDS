import {PriorityQueue} from './queue.js';
import {heuristicApprox} from '../js/pathModules.js';

function bestFirstSearch(cyGraph, startNode, endNode) {
  let openQueue = new PriorityQueue();
  let closedQueue = new Set(); // Close list
  let currentNode = {}; // The minimum distance element from the open queue.
  let adjacentNode = {};

  startNode.data(
    'distanceOrigin1',
    heuristicApprox(cyGraph, startNode.id(), endNode.id())
  );
  startNode.data('_parent', null);

  openQueue.enqueue(startNode, 'distanceOrigin1');
  /*   console.log(startNode.id(), cyGraph.getPos(startNode.id()));
  console.log(heuristicApprox(cyGraph, startNode.id(), endNode.id())); */

  // While-loop runs until the queue is empty OR until we have reached the endNode.
  while (!openQueue.isEmpty()) {
    currentNode = openQueue.dequeue();

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
          'distanceOrigin1',
          heuristicApprox(cyGraph, adjacentNode.id(), endNode.id())
        );

        /** This code only runs if possibleImprovedCost is larger than the current cost.
         * Updates the successor's cost using possibleImprovedCost and the heuristic
         * approximation. Also assigns the parent of the successor. */
        adjacentNode.data(
          'distanceOrigin1',
          heuristicApprox(cyGraph, adjacentNode.id(), endNode.id())
        );
        openQueue.enqueue(adjacentNode, 'distanceOrigin1');

        adjacentNode.data('_parent', currentNode.id());
        closedQueue.add(currentNode);

        openQueue.enqueue(adjacentNode, 'distanceOrigin1');
        /*         console.log(adjacentNode.id(), cyGraph.getPos(adjacentNode.id()));
        console.log(heuristicApprox(cyGraph, adjacentNode.id(), endNode.id())); */
      }
    });
  }
  if (currentNode.id() !== endNode.id()) {
    throw new Error('A* error: Open list is empty. Path could not be found!');
  }
}

export {bestFirstSearch};
