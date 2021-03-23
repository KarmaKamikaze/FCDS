import { dijkstra, traceback } from '../js/dijkstra.js'

export let eleType = {
  default: "default",
  courier: "courier",
  restaurant: "restaurant",
  customer: "customer",
  route: "route",
  routeDone: "routeDone"
};

export class CyGraph {
  constructor(graph, courierCount = 0) {
    this.graph = graph;
    this.courierCount = courierCount;
  }

  // Arrays that keep track of all the elements in the graph
  couriers = [];
  restaurants = [];
  customers = [];
  orders = [];

  /**
    * Adds a node at specified location with potential weight
    * @param {String} nodeId An ID for the node
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
      },
      position: {
        x: xCoord,
        y: yCoord,
      },
    });

    // add the node to the corresponding type-array of the CyGraph
    if(type !== eleType.default) {
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
  addCourier(rootNode, _hasCar = false) {
    let node = this.graph.add({
      group: "nodes",
      data: {
        id: `courier${++this.courierCount}`,
        hasCar: _hasCar,
        currentNode: rootNode,
      },
      position: {
        x: this.getPos(rootNode).x,
        y: this.getPos(rootNode).y,
      },
    });
    node.addClass(eleType.courier);
    this.couriers.push(node); // add the courier to the list of couriers
  }

  /**
   * Adds an edge between two nodes in the network
   * @param {String} sourceNode The source node of the edge
   * @param {String} targetNode The target node of the edge
   * @param {Boolean} isOneWay Whether the edge is only traversible one way (true) or not (false)
   */
  addEdge(sourceNode, targetNode, isOneWay = false) {
    this.graph.add({
      group: "edges",
      data: {
        source: sourceNode,
        target: targetNode,
        id: sourceNode + targetNode,
        oneway: isOneWay,
      },
    });
    this.calcLength(sourceNode + targetNode);
  }

  /** Initializes name and length of every edges. */
  initializeEdges() {
    let edges = this.graph.edges(),
        n = edges.length;
    for (let i = 0; i < n; i++) {
      let source = edges[i].data("source"),
          target = edges[i].data("target"),
          newId = source + target;
      this.addEdge(source, target);
      this.addEdge(target, source); // add a reverse edge for bidirectional movement ;D
      this.delNode(edges[i].id());
      this.calcLength(newId);
    }
  }

  /** Initializes the type of every nodes */
  initializeNodes() {
    let nodes = this.graph.nodes(),
        n = nodes.length;
    for (let i = 0; i < n; i++) {
      let type = nodes[i].data("type");
      try {
        if(type !== eleType.default) {
          this[type + "s"].push(nodes[i]);
        }
      } catch (e) {
        console.warn(`Node type: ${type} is invalid. (Error:${e})`);
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
        length = Math.sqrt((pos2.x - pos1.x) * (pos2.x - pos1.x) + (pos2.y - pos1.y) * (pos2.y - pos1.y));
    edge.data("length", length);
    return length;
  }

  /**
   * Gets the length of an edge between two nodes.
   * @param {String} sourceNode The source node
   * @param {String} targetNode
   * @param {Boolean} ignoreDirection Whether to ignore the edge direction (true) or not (false)
   * @returns The length of the edge between the specified nodes
   */
  getLength(sourceNode, targetNode, ignoreDirection = false) {
    let edges = this.graph.$id(sourceNode).connectedEdges(),
        n = edges.length;
    for (let i = 0; i < n; i++) {
      let target = edges[i].data("target"),
          source = edges[i].data("source");
      if (target === targetNode || (ignoreDirection && source === targetNode)) {
        return edges[i].data("length");
      }
    }
  }

  /**
   * Gets the position (x, y) of an element
   * @param {String} nodeId The ID of the element to inspect
   * @returns The position (x, y) of the element
   */
  getPos(nodeId) {
    return this.graph.$id(nodeId)["_private"].position;
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
   * Uses Dijkstra's algorithm to find the shortest path between a start and end node.
   * @param {String} courierId The ID of the courier.
   * @param {String} EndId The ID of the destination.
   */
  traversePath(courierId, endId) {
    let courierPos = this.graph.$id(courierId).data("currentNode");
    dijkstra(this.graph.elements(), this.graph.$id(courierPos));
    let path = traceback(this.graph.elements(), this.graph.$id(endId));
    this.animateCourier(path, courierId);
  }

  /**
   * Animates the movement of a courier from point A to B, highlighting the route.
   * @param {Array} path The array of nodes produced by a pathfinding algorithm
   * @param {String} courierId The ID of the courier to animate
   * @param {Number} index The index to start from (default: 0)
   */
  animateCourier(path, courierId, index = 0) {
    let diff1 = this.getPos(path[index + 1]).x - this.getPos(path[index]).x,
        diff2 = this.getPos(path[index + 1]).y - this.getPos(path[index]).y,
        edge = this.graph.$id(path[index] + path[index + 1]),
        edgeRev = this.graph.$id(path[index + 1] + path[index]),
        steps = this.getLength(path[index], path[index + 1]) * 2,
        courier = this.graph.$id(courierId),
        i = 0;
    edge.addClass(eleType.route);
    edgeRev.addClass(eleType.routeDone);
    let anim = setInterval(() => {
      courier.shift({ x: diff1 / steps, y: diff2 / steps });
      i++;
      if (i >= steps) {
        clearInterval(anim);
        edge.addClass(eleType.routeDone);
        edgeRev.addClass(eleType.routeDone);
        setTimeout(() => {
          edge.removeClass(eleType.route + " " + eleType.routeDone);
          edgeRev.removeClass(eleType.route + " " + eleType.routeDone);
          courier.data("currentNode", path[index + 1]);
          if (index + 1 < path.length - 1) {
            console.log(
              courier.id() + " went through " + courier.data("currentNode")
            );
            return this.animateCourier(path, courierId, index + 1);
          } else {
            console.log(
              courier.id() + " arrived at " + courier.data("currentNode")
            );
            return;
          }
        }, 250);
      }
    }, 10);
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



/**
 * Moves a node to a new point in the network
 * @param {String} nodeID The ID of node to be moved
 * @param {Number} xCoord The X coordinate of the new position
 * @param {Number} yCoord The Y coordinate of the new position
 */
function moveNode(nodeId, xCoord, yCoord) {
  this.graph.$id(nodeId).relativePosition({
    x: xCoord,
    y: yCoord,
  });
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
