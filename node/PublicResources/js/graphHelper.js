import { traceback } from "../js/pathModules.js";
import { SimStats } from "./stats.js";

let eleType = {
  default: "default",
  courier: "courier",
  restaurant: "restaurant",
  customer: "customer",
  route: "route",
  routeDone: "routeDone",
  idlezone_yellow: "idlezone-yellow",
  idlezone_orange: "idlezone-orange",
  idlezone_red: "idlezone-red",
  lunch: "lunch",
  dinner: "dinner",
};

class CyGraph {
  constructor(name, graph, pathFunc, tickSpeed = 1000) {
    this.name = name;
    this.graph = graph;
    this.pathFunc = pathFunc;
    this.tickSpeed = tickSpeed;
    this.courierCount = 0;
    this.simulationStats = new SimStats();
  }

  // Arrays that keep track of all elements in the graph
  couriers = new Array();
  restaurants = new Array();
  customers = new Array();
  orders = new Array();
  idleZones = new Array();

  /**
   * Sorts orders based on start times
   */
  sortOrders() {
    this.orders.sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * Adds a node at specified location with potential weight
   * @param {String} nodeId An ID for the node
   * @param {String} type The type of the node, customer or restaurant (defaults to regular node)
   * @param {Number} xCoord The x coordinate
   * @param {Number} yCoord The y coordinate
   * @param {Number} nodeWeight The specified weight (defaults to 1)
   */
  addNode(nodeId, type = eleType.default, xCoord, yCoord, nodeWeight = 1) {
    let node = this.graph.add({
      group: "nodes",
      data: {
        weight: nodeWeight,
        id: nodeId,
        _parent: null,
        distanceOrigin: 0,
        couriers: new Array(),
      },
      position: {
        x: xCoord,
        y: yCoord,
      },
    });

    // add the node to the corresponding type-array of the CyGraph
    if (type !== eleType.default) {
      this[type + "s"].push(node);
    }
  }

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
   * @param {String} rootNode The node for the courier to be placed on
   * @param {Boolean} _hasCar Whether the courier drives a car or not
   */
  addCourier(rootNodeId, _hasCar = false) {
    let node = this.graph.add({
      group: "nodes",
      data: {
        id: `courier${++this.courierCount}`,
        hasCar: _hasCar,
        currentNode: rootNodeId,
        currentOrder: null,
      },
      position: {
        x: this.getPos(rootNodeId).x,
        y: this.getPos(rootNodeId).y,
      },
    });
    node.addClass(eleType.courier);
    this.couriers.push(node); // add the courier to the list of couriers
    this.graph.$id(rootNodeId).couriers.push(node);
  }

  /**
   * Adds an edge between two nodes in the network
   * @param {String} sourceNode The source node of the edge
   * @param {String} targetNode The target node of the edge
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

      this.addEdge(newId, source, target, obstructions);
      this.addEdge(newIdRev, target, source, obstructions);

      this.delNode(edges[i].id());

      this.graph.$id(newId).inRoute = new Array();
      this.graph.$id(newIdRev).inRoute = new Array();
    }
  }

  /** Initializes the type of every nodes */
  initializeNodes() {
    let nodes = this.graph.nodes(),
      n = nodes.length;
    for (let i = 0; i < n; i++) {
      nodes[i].couriers = new Array();

      // Get only the first character of the ID
      // Then push the node into the corresponding list
      let type = nodes[i].id().charAt(0);
      nodes[i].data("heat", 0);
      switch (type.toUpperCase()) {
        case "R":
          nodes[i].data("orderRate", 0.25); // assign individual order probability
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
   * @param {String} targetNode
   * @returns The length of the edge between the specified nodes
   */
  getLength(sourceNode, targetNode) {
    let edgeId = this.getEdgeId(sourceNode, targetNode);
    return this.graph.$id(edgeId).data("length");
  }

  /**
   * Returns the ID of the edge connecting the two nodes. (Lexicographically)
   * @param {String} node1Id The ID of the first node
   * @param {String} node2Id The ID of the second node
   * @returns A concatenated string of the two nodes sorted lexicographically
   */

  /*   getEdgeIdOld(node1Id, node2Id) {
    return node1Id.localeCompare(node2Id) === -1
      ? node1Id + node2Id
      : node2Id + node1Id;
  } */

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
    let graph = this.graph.elements(),
      courier = this.graph.$id(courierId),
      startNode = this.graph.$id(courier.data("currentNode")),
      endNode = this.graph.$id(endId);
    // Updates the order status to be in transit. Used in statistics.
    let order = courier.data("currentOrder");
    order.status = "transit";

    this.pathFunc(this, startNode, endNode);
    let path = traceback(graph, endNode);
    let edges = this.getRoute(path);
    for (const edge of edges) {
      edge.inRoute.push(courierId);
    }
    edges.addClass(eleType.route);
    this.animateCourier(path, courier, edges);
    //#region DEBUG
    let pathStr = `[${this.name}] ${courierId} ${startNode}`;
    for (let k of path) {
      if (k !== startNode) pathStr += `->${k}`;
    }
    //#endregion
  }

  /**
   * Animates the movement of a courier from point A to B, highlighting the route.
   * @param {Array} path The array of nodes produced by a pathfinding algorithm
   * @param {String} courierId The ID of the courier to animate
   * @param {Number} index The index to start from (default: 0)
   */

  animateCourier(path, courier, edges, index = 0) {
    if (path.length === 1) {
      let order = courier.data("currentOrder");
      if (order && courier.data("currentNode") === order.restaurant.id()) {
        return this.traversePath(courier.id(), order.customer.id());
      }
    }

    let nextPos = this.getPos(path[index + 1]),
      currentPos = this.getPos(path[index]),
      diff1 = nextPos.x - currentPos.x,
      diff2 = nextPos.y - currentPos.y,
      steps = ~~(this.getLength(path[index], path[index + 1]) / 100),
      i = 0,
      perTick = ~~(this.tickSpeed / 20);

    let anim = setInterval(() => {
      courier.shift({ x: diff1 / steps, y: diff2 / steps });
      i++;
      if (i >= steps) {
        clearInterval(anim);
        courier.data("currentNode", path[index + 1]);
        if (index < path.length - 2) {
          // on traversing a node
          //  console.log(`[${this.name}] ${courier.id()} went through ${courier.data("currentNode")}`);
          return this.animateCourier(path, courier, edges, index + 1);
        } else {
          for (const edge of edges) {
            let index = edge.inRoute.indexOf(courier.id());
            edge.inRoute.splice(index, 1);
            if (!edge.inRoute.length) {
              edge.removeClass(eleType.route);
            } else {
              edge.addClass(eleType.route);
            }
          }
          // on arrival
          // check if the current node is the restaurant node of a given order, then send the courier to its destination
          let order = courier.data("currentOrder");
          if (order && courier.data("currentNode") === order.restaurant.id()) {
            return this.traversePath(courier.id(), order.customer.id());
          }

          this.graph.$id(path[index + 1]).couriers.push(courier);
          // otherwise the order has been delivered at its destination, and we can reset the courier
          courier.data("currentOrder", null);
          order.endTime = this.simulationStats.simTimeMinutes;
          order.endTimeClock = this.simulationStats.simTime;
          order.status = "delivered";
          this.simulationStats.deliveredOrdersArr.push(order); // Stat: includes the delivered order in the array of delivered orders
          this.simulationStats.avgDeliveryTime(); // Stat: calculates the average delivery time across all deliveries
          this.moveNode(courier.id(), nextPos.x, nextPos.y);
          return;
        }
      }
    }, perTick);
  }

  getRoute(path) {
    let edges = this.graph.collection();
    for (let i = 0; i < path.length - 1; i++) {
      edges.push(this.graph.$id(path[i] + path[i + 1]));
      edges.push(this.graph.$id(path[i + 1] + path[i]));
    }
    return edges;
  }

  /** Prints the nodes of the network as well as their connected edges */
  listNetwork() {
    let nodes = this.graph.nodes(),
      n = nodes.length,
      netStr = "";

    for (let i = 0; i < n; i++) {
      netStr += `Node: ${nodes[i].id()}\n`;
      let conEdges = nodes[i].connectedEdges(),
        m = conEdges.length;
      if (conEdges) {
        for (let j = 0; j < m; j++) {
          netStr += `Connected edge: ${conEdges[j].id()}\n`;
        }
      }
    }
    console.log(netStr);
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

// Unused functions

/**
 * Selects a random position in the map
 * @returns The coordinates of the random position
 */
function getRandomPos() {
  let pos = {
    x: getRandomInt(Viewport.width) - Viewport.width / 2,
    y: getRandomInt(Viewport.height) - Viewport.height / 2,
  };
  return pos;
}

/* WIP: Generate random customers in the network
  let numCustomers = 0;
  function generateCustomer() {
    let maxNodeDistance = 100, // global variable?
        randPos = getRandomPos(),
        nodes = this.graph.nodes(),
        n = nodes.length;

    for(i = 0; i < n; i++) {
        let orgPos = nodes[i].position(),
            distance = Math.sqrt((randPos.x-orgPos.x)*(randPos.x-orgPos.x)+(randPos.y-orgPos.y)*(randPos.y-orgPos.y));

        if(distance <= maxNodeDistance) {
            if(i === n-1) {
                return; // could not find a valid position
            }
            else { // set a new random position and try again
                randPos = getRandomPos();
                i = 0;
            }
        }
    }
    addNode(`C${++numCustomers}`, randPos.x, randPos.y);
  }*/

export { eleType, CyGraph };
