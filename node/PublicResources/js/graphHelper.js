import { traceback } from "../js/pathModules.js";
import { dijkstra } from "./dijkstra.js";
import { SimStats } from "./stats.js";
import { formatTime } from "./orderGeneration.js";
export { eleType, CyGraph };

const simStartTime = 479; //The desired start time for the simulation in raw minutes, default 479 (7:59 AM).

let eleType = {
  default: "default",
  courier: "courier",
  restaurant: "restaurant",
  customer: "customer",
  inroute: "inroute",
  obstructions: "obstructions",
  idlezone_yellow: "idlezone-yellow",
  idlezone_orange: "idlezone-orange",
  idlezone_red: "idlezone-red",
  lunch: "lunch",
  dinner: "dinner",
};

class CyGraph {
  constructor(
    name,
    graph,
    pathFunc,
    distancePerTick,
    orderRate,
    idleZoneAmount,
    headless,
    courierFreq,
    tickDuration,
    obstructionLevel
  ) {
    this.name = name;
    this.graph = graph;
    this.pathFunc = pathFunc;
    this.tickDuration = tickDuration;
    this.courierCount = 0;
    this.simulationStats = new SimStats();
    this.distancePerTick = distancePerTick;
    this.headless = headless;
    this.timeMinutes = simStartTime;
    this.idleZoneAmount = idleZoneAmount;
    this.orderRate = orderRate;
    this.courierFreq = courierFreq;
    this.obstructionLevel = obstructionLevel;
    this.graphRadius = null;
  }

  // Arrays that keep track of all elements in the graph
  couriers = new Array();
  restaurants = new Array();
  customers = new Array();
  orders = new Array();
  idleZones = new Array();
  obstructions = new Array();

  /**
   * Removes a node and returns it
   * @param {String} nodeId The node ID to remove
   * @returns The deleted node
   */
  delNode(nodeId) {
    return this.graph.$id(nodeId).remove();
  }

  /**
   * Adds a courier to the map on rootNode
   * @param {Object} rootNode the node to place the courier at, null causes random position through if-statement.
   */
  addCourier(rootNode = null) {
    let nodes = this.graph.nodes().filter((n) => this.couriers.indexOf(n));
    let i = this.getRandomInt(nodes.length - 1),
      randomNode = rootNode ? this.graph.$id(rootNode) : nodes[i];

    let courier = this.graph.add({
      group: "nodes",
      data: {
        id: `courier${++this.courierCount}`,
        currentNode: randomNode,
        currentOrder: null,
        pendingOrder: false,
        movingOrder: false,
      },
      position: { x: randomNode.position("x"), y: randomNode.position("y") },
    });
    courier.addClass(eleType.courier);
    this.couriers.push(courier); // add the courier to the list of couriers
    if (this.idleZoneAmount > 0 && this.orders.length === 0) {
      this.moveToIdleZone(courier);
    }
    return courier;
  }

  /**
   * Adds an edge between two nodes in the network
   * @param {String} _id the desired ID of the edge
   * @param {String} _source The source node of the edge
   * @param {String} _target The target node of the edge
   * @param {Number} _obstructions The desired obstruction level of the edge
   */
  addEdge(_id, _source, _target, _obstructions) {
    this.graph.add({
      group: "edges",
      data: {
        source: _source,
        target: _target,
        id: _id,
        obstructions: _obstructions,
      },
    });
    this.calcLength(_id);
    this.calculateWeight(_id);
  }

  /** Initializes name and length of all edges. */
  initializeEdges() {
    let edges = this.graph.edges(),
      n = edges.length;
    for (let i = 0; i < n; i++) {
      let source = edges[i].data("source"),
        target = edges[i].data("target"),
        newId = this.getEdgeId(source, target),
        newIdRev = this.getEdgeId(target, source),
        obstructions = edges[i].data("obstructions");
      if (!obstructions) {
        obstructions = 1;
      }
      this.addEdge(newId, source, target, obstructions);
      this.addEdge(newIdRev, target, source, obstructions);
      this.delNode(edges[i].id());
      this.graph.$id(newId).inRoute = new Array();
      this.graph.$id(newIdRev).inRoute = new Array();
    }
  }

  /** Initializes the type of all nodes */
  initializeNodes() {
    let nodes = this.graph.nodes(),
      n = nodes.length;
    for (let i = 0; i < n; i++) {
      // Get only the first character of the ID
      // Then push the node into the corresponding list
      let type = nodes[i].id().charAt(0);
      nodes[i].data("heat", 0);
      switch (type.toUpperCase()) {
        case "R":
          nodes[i].data("orderRate", this.orderRate); // assign individual order probability
          nodes[i].addClass(eleType.restaurant);
          this.restaurants.push(nodes[i]);
          break;
        case "C":
          this.customers.push(nodes[i]);
          nodes[i].addClass(eleType.customer);
          break;
        case "N":
          // The node is a regular node (road junctions, etc.)
          break;
        default:
          console.warn(`Did not recognize the type of node: ${nodes[i].id()}`);
      }
    }
  }

  /**
   * Calculates the length of a specific edge using Pythagora's theorem
   * @param {String} edgeId The ID of the edge to calculate the length of
   * @returns The length of the edge
   */
  calcLength(edgeId) {
    let edge = this.graph.$id(edgeId),
      pos1 = this.getPos(edge.data("source")),
      pos2 = this.getPos(edge.data("target")),
      length = Math.sqrt(
        (pos2.x - pos1.x) * (pos2.x - pos1.x) +
          (pos2.y - pos1.y) * (pos2.y - pos1.y)
      );
    edge.data("length", length);
    return length;
  }

  /**
   * Gives an edge a weight by calculating its property and assigning it to weight property
   * @param {String} edgeId The ID of the edge whose weight is being calculated
   */
  calculateWeight(edgeId) {
    let edge = this.graph.$id(edgeId);
    let obstructions = edge.data("obstructions")
      ? edge.data("obstructions")
      : 1;
    edge.data("weight", edge.data("length") * obstructions);
  }

  /**
   * Gets the length of an edge between two nodes.
   * @param {String} sourceNode The source node
   * @param {String} targetNode The target node
   * @returns The length of the edge between the specified nodes
   */
  getLength(sourceNode, targetNode) {
    let edgeId = this.getEdgeId(sourceNode, targetNode);
    return this.graph.$id(edgeId).data("length");
  }

  /**
   * Returns the ID of the edge connecting the two nodes.
   * @param {String} node1Id The ID of the first node
   * @param {String} node2Id The ID of the second node
   * @returns A concatenated string of the two nodes, the ID of the edge.
   */
  getEdgeId(node1Id, node2Id) {
    return node1Id + node2Id;
  }

  /**
   * Gets the position (x, y) of an element
   * @param {String} nodeId The ID of the element to inspect
   * @returns The position (x, y) of the element
   */
  getPos(nodeId) {
    return this.graph.$id(nodeId).position();
  }

  /**
   * Choose random integer between 0 and max
   * @param {Number} max The maximum integer to return
   * @returns The random integer
   */
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * Uses Dijkstra's console.log
   * algorithm to find the shortest path between a start and end node.
   * @param {String} courierId The ID of the courier.
   * @param {String} EndId The ID of the destination.
   */
  traversePath(courierId, endId) {
    let courier = this.graph.$id(courierId),
      startNode = courier.data("currentNode"),
      endNode = this.graph.$id(endId);
    this.pathFunc(this, startNode, endNode);
    let path = traceback(this.graph, startNode, endNode);
    let order = courier.data("currentOrder");
    if (order) {
      order.status = "transit";
    }
    if (this.headless || this.tickDuration < 100) {
      this.moveCourierHeadless(courier, path);
    } else {
      // Edge/route highlighting
      let pathEdges = this.getRoute(path);
      for (const edge of pathEdges) {
        edge.inRoute.push(courierId);
      }
      pathEdges.addClass(eleType.inroute);
      this.animateCourier(path, courier, pathEdges);
    }
  }

  /**
   * Moves the designated courier along the input path and performs an action based on the destination.
   * @param {Object} courier The courier node to move.
   * @param {Array} path The path generated by the traceback algorithm.
   * @param {Number} i The index of the current node in the path array.
   */
  moveCourierHeadless(courier, path, i = 0) {
    let curNode = this.graph.$id(path[i]),
      nextNode = this.graph.$id(path[i + 1]);

    // If the courier is moving towards an idle zone, stop the current route and begin on the order delivery
    if (courier.data("pendingOrder")) {
      courier.data("pendingOrder", false);
      courier.data("moving", false);
      return this.traversePath(
        courier.id(),
        courier.data("currentOrder").restaurant.id()
      );
    }

    // The current node is not the destination
    if (i < path.length) {
      courier.position(curNode.position());
      courier.data("currentNode", curNode);
      let distance = this.graph
          .$id(this.getEdgeId(curNode.id(), nextNode.id()))
          .data("weight"),
        timeout = (distance / this.distancePerTick) * this.tickDuration;
      setTimeout(() => this.moveCourierHeadless(courier, path, i + 1), timeout);
    }
    // The current node is the destination
    else {
      let order = courier.data("currentOrder");
      if (courier.data("moving")) {
        courier.data("moving", false);
      }
      if (order) {
        // If the destination is a restaurant, send the courier to the order's customer
        if (path[i - 1] == order.restaurant.id()) {
          this.traversePath(courier.id(), order.customer.id());
        }
        // Otherwise the courier has arrived at the customer, so the order has been successfully delivered
        else if (path[i - 1] == order.customer.id()) {
          this.deliverOrder(courier, order);
        }
      }
    }
  }

  /**
   * Moves the designated courier to the closest idle zone.
   * @param {Object} courier The courier node to move.
   */
  moveToIdleZone(courier) {
    let startNode = courier.data("currentNode");
    courier.data("moving", true);
    dijkstra(this, startNode);
    let lowestDistance = Infinity,
      bestZone = null;
    for (const zone of this.idleZones) {
      let dist = zone.data("distanceOrigin");
      if (dist < lowestDistance) {
        lowestDistance = dist;
        bestZone = zone;
      } // The best zone has been found, being the closest
    }
    if (bestZone) {
      this.traversePath(courier.id(), bestZone.id());
    }
  }

  /**
   * Animates the movement of a courier from point A to B, highlighting the route.
   * @param {Array} path The array of nodes produced by a pathfinding algorithm
   * @param {String} courier The courier object to animate
   * @param {Number} index The index to start from (default: 0)
   */
  animateCourier(path, courier, edges, index = 0) {
    if (path.length === 1) {
      // The courier is already at the destination
      let order = courier.data("currentOrder");
      if (order && courier.data("currentNode") === order.restaurant) {
        return this.traversePath(courier.id(), order.customer.id());
      }
      if (courier.data("moving")) {
        courier.data("moving", false);
        return;
      }
    }

    // Preparing all necessary variables
    let nextPos = this.getPos(path[index + 1]),
      currentPos = this.getPos(path[index]),
      diff1 = nextPos.x - currentPos.x,
      diff2 = nextPos.y - currentPos.y,
      steps = ~~(this.getLength(path[index], path[index + 1]) / 10),
      i = 0,
      perTick = ~~(this.tickDuration / 30);

    let anim = setInterval(() => {
      // Interval based animation by small steps of movement on edges
      courier.shift({ x: diff1 / steps, y: diff2 / steps });
      i++;
      if (i >= steps) {
        // When done stepping
        clearInterval(anim);
        courier.data("currentNode", this.graph.$id(path[index + 1]));
        if (courier.data("pendingOrder")) {
          // If heading to idle zone, and received an order
          courier.data("pendingOrder", false);
          courier.data("moving", false);
          for (const edge of edges) {
            let courierIndex = edge.inRoute.indexOf(courier.id());
            edge.inRoute.splice(courierIndex, 1);
            if (!edge.inRoute.length) {
              edge.removeClass(eleType.inroute);
            } else {
              edge.addClass(eleType.inroute);
            }
          }
          return this.traversePath(
            courier.id(),
            courier.data("currentOrder").restaurant.id()
          );
        } else if (index < path.length - 2) {
          // Upon arrival to non final node
          return this.animateCourier(path, courier, edges, index + 1);
        } else {
          // Upon arrival to final node
          for (const edge of edges) {
            let courierIndex = edge.inRoute.indexOf(courier.id());
            edge.inRoute.splice(courierIndex, 1);
            if (!edge.inRoute.length) {
              edge.removeClass(eleType.inroute);
            } else {
              edge.addClass(eleType.inroute);
            }
          }
          let order = courier.data("currentOrder");
          if (courier.data("moving")) {
            courier.data("moving", false);
          }
          if (order) {
            // check if the current node is the restaurant node of a given order, then send the courier to its destination
            if (courier.data("currentNode") === order.restaurant) {
              return this.traversePath(courier.id(), order.customer.id());
            }
            // otherwise the order has been delivered at its destination, and we can reset the courier
            this.deliverOrder(courier, order, nextPos);
          }
          return;
        }
      }
    }, perTick);
  }

  /**
   * Updates stats and runs functions upon delivering an order
   * @param {Object} courier The courier which should complete its order
   * @param {Object} order The order to be delivered
   * @param {Object} targetNode The node to place the courier on (to fix positional offset in non-headless mode)
   */
  deliverOrder(courier, order, targetNode = null) {
    // get order time, update stats
    order.endTime = this.timeMinutes;
    order.endTimeClock = formatTime(this.timeMinutes);
    order.deliveryTime = order.endTime - order.startTime;
    order.status = "delivered";
    this.simulationStats.deliveredOrdersArr.push(order);
    this.simulationStats.totalDeliveryTime += order.deliveryTime;
    // if the delivery took > 60 min, consider it a failed delivery
    if (order.deliveryTime > 60) {
      this.simulationStats.failedOrders++;
    }

    // If the courier is to be removed from the graph, remove when they arrive at their final destination
    if (courier.data("terminationImminent")) {
      this.delNode(courier.id());
      return;
    }

    if (targetNode) {
      this.moveNode(courier.id(), targetNode.x, targetNode.y);
    }

    courier.data("currentOrder", null);
    // If there are no pending orders, send the courier to an idle zone
    if (this.idleZoneAmount > 0 && !this.orders.length) {
      this.moveToIdleZone(courier);
    }
  }

  /**
   * Creates a collection of edges (a route) based on a path from traceback
   * @param {Array} path Array of nodes to traverse
   * @returns A collection of edges (which connect nodes in the path) to traverse
   */
  getRoute(path) {
    let edges = this.graph.collection();
    for (let i = 0; i < path.length - 1; i++) {
      edges.push(this.graph.$id(path[i] + path[i + 1]));
      edges.push(this.graph.$id(path[i + 1] + path[i]));
    }
    return edges;
  }

  /**
   * Moves a node to a new point in the network
   * @param {String} nodeID The ID of node to be moved
   * @param {Number} xCoord The X coordinate of the new position
   * @param {Number} yCoord The Y coordinate of the new position
   */
  moveNode(nodeId, xCoord, yCoord) {
    this.graph.$id(nodeId).relativePosition({
      x: xCoord,
      y: yCoord,
    });
  }
}
