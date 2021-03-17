/**
 * Class to create queue elements and assign their distance,
 * which in this case is their priority.
 */
class QueueElement {
  constructor(identifier, distance) {
    this.identifier = identifier;
    this.distance = distance;
  }
}

/**
 * Class to hold the priority queue set. Since the queue can keep
 * growing dynamically, as we add elements, it will never overflow.
 */
export class PriorityQueue {
  constructor() {
    this.distances = new Array();
  }

  enqueue(identifier, distance) {
    let queueElement = new QueueElement(identifier, distance);
    let fitsBetween = false; // Boolean to decide if the element fits between others.

    for (let i = 0; i < this.distances.length; i++) {
      /**
       * Since it is a min-queue, we check from the first element, which
       * contains the lowest distance and therefore has the highest priority,
       * until we hit an element who has a larger distance. Then we insert the
       * queue element in the queue.
       */
      if (this.distances[i].distance > queueElement.distance) {
        this.distances.splice(i, 0, queueElement);
        fitsBetween = true;
        break;
      }
    }

    // Element is pushed to the end of the queue if it does not fit between.
    if (!fitsBetween) {
      this.distances.push(queueElement);
    }
  }

  dequeue() {
    if (this.isEmpty) {
      throw new Error("Cannot dequeue (Underflow). The queue is empty!");
    }
    // Removes the first element of the queue.
    else {
      return this.distances.shift();
    }
  }

  front() {
    if (this.isEmpty) {
      throw new Error("There is no front. The queue is empty!");
    }
    // Return the lowest distance element, as this is a minimum priority queue.
    else {
      return this.distances[0];
    }
  }

  isEmpty() {
    return this.distances.length == 0;
  }
}
