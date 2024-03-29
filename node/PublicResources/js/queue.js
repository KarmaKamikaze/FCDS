export { PriorityQueue };

/**
 * Class to hold the priority queue set. Since the queue can keep
 * growing dynamically, as we add elements, it will never overflow.
 */
class PriorityQueue {
  constructor() {
    this.nodes = new Array();
  }

  enqueue(element) {
    let fitsBetween = false; // Boolean to decide if the element fits between others.

    for (let i = 0; i < this.nodes.length; i++) {
      /**
       * Since it is a min-queue, we check from the first element, which
       * contains the lowest distance and therefore has the highest priority,
       * until we hit an element who has a larger distance. Then we insert the
       * queue element in the queue.
       */
      if (
        this.nodes[i].data(`distanceOrigin`) > element.data(`distanceOrigin`)
      ) {
        this.nodes.splice(i, 0, element);
        fitsBetween = true;
        break;
      }
    }

    // Element is pushed to the end of the queue if it does not fit between.
    if (!fitsBetween) {
      this.nodes.push(element);
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Cannot dequeue (Underflow). The queue is empty!");
    }
    // Removes the first element of the queue.
    else {
      return this.nodes.shift();
    }
  }

  isEmpty() {
    return this.nodes.length === 0;
  }
}
