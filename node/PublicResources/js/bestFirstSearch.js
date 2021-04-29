import { PriorityQueue } from "./queue.js";
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

/* placeholders "ADDTOQUEUE", "REMOVEFROMQUEUE", "TRACEBACK"*/
export function bestFirstSearch(graph, currentNode, endNode) {
  let openQueue = new PriorityQueue();

  openQueue.enqueue.cy.$id(startNode).neighborhood((ele) => ele.isNode());
  console.log(openQueue);

  //when done with node:
/*   closedQueue.ADDTOQUEUE.openQueue.cy.$id(`${currentNode
  openQueue.REMOVEFROMQUEUE.cy.$id(`${currentNode}`); */

  //check for goal node:
/*   if (currentNode === endNode) {
    return TRACEBACK;
  } else {
    recQueue(graph, openQueue.nodes[0], endNode);
  } */
}

function recQueue(graph, currentNode, endNode)