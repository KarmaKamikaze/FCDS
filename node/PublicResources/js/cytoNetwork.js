import { dijkstra, traceback } from '../js/dijkstra.js'

let NETWORK_FILE = "../networks/TestDijkstra1.cyjs";
let CLASS_COURIER = "courier",
    CLASS_RESTAURANT = "restaurant",
    CLASS_CUSTOMER = "customer",
    CLASS_ROUTE = "route",
    CLASS_ROUTE_DONE = "routeDone";

let Viewport = {
  width: parseInt(getComputedStyle(document.getElementById("cy")).width),
  height: parseInt(getComputedStyle(document.getElementById("cy")).height)
};

let courierCount = 0;

let cy = initNetwork();
// Initialize the cytoscape network
function initNetwork() {
  let cy = cytoscape({
    container: document.getElementById('cy'),
  
    boxSelectionEnabled: false,
    autounselectify: true,
    autoungrabify: true,
    
    style: cytoscape.stylesheet()
    .selector('node')
      .style({
        'content': 'data(id)',
        'color': 'white'
      })
    .selector('edge')
      .style({
        'curve-style': 'straight',
        'target-arrow-shape': 'none',
        'width': 3,
        'line-color': 'white',
        'target-arrow-color': 'white',
        'color': 'lightgreen',
        'content': ''
      })
    .selector(`.${CLASS_ROUTE}`)
      .style({
        'background-color': '#B22222',
        'line-color': '#B22222',
        'target-arrow-color': '#B22222',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.25s'
      })
    .selector(`.${CLASS_ROUTE_DONE}`)
      .style({
        'background-color': 'white',
        'line-color': 'white',
        'target-arrow-color': 'white',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.25s'
      })
    .selector(`.${CLASS_COURIER}`)
      .style({
        'width': 20,
        'height':20,
        'background-color': '#B22222',
        'content': ''
      })
    .selector(`.${CLASS_CUSTOMER}`)
      .style({
        'width': 20,
        'height':20,
        'background-color': '#00CED1',
        'content': ''
      })
  });
  
  fetch(NETWORK_FILE)
  .then( response => response.json() )
  .then( exportedJson => {
    cy.json(exportedJson); // and use the json verbatim
  })
  .then( () => initLength() )
  .then( () => initNames() )
  .then( () => cy.fit(cy.elements()))
  .then( () => {
    addEdge("n2", "center");
    addEdge("end", "center");
    delNode("startend");
    delNode("endstart");
    addCourier("start");
    addCourier("start");
    traversePath("courier1", "center");
    traversePath("courier2", "end");
  });
  return cy; // return the initialized network cy
}

 /** 
  * Adds a node at specified location with potential weight
  * @param {String} nodeId An ID for the node
  * @param {Number} xCoord The x coordinate
  * @param {Number} yCoord The y coordinate
  * @param {Number} nodeWeight The specified weight (defaults to 1)
  */
function addNode (nodeId, xCoord, yCoord, nodeWeight = 1) {
  cy.add({
    group: 'nodes',
    data: {
      weight: nodeWeight,
      id: nodeId,
      _parent: null,
      distanceOrigin: 0
    },
    position: {
      x: xCoord,
      y: yCoord 
    }
  });
}

/**
 * Removes a node and returns it
 * @param {String} nodeId The node ID to remove
 * @returns The deleted node
 */
function delNode (nodeId) {
  return cy.$id(nodeId).remove();
}

/**
 * Adds a courier to the map on rootNode
 * @param {String} rootNode The node for the courier to be placed on
 * @param {Boolean} _hasCar Whether the courier drives a car or not
 */
function addCourier (rootNode, _hasCar = false) {
  let node = cy.add({
    group: 'nodes',
    data: { 
      id: (`courier${++courierCount}`),
      hasCar: _hasCar,
      currentNode: rootNode},
      position: {
        x: getPos(rootNode).x, 
        y: getPos(rootNode).y
      },
  });
  node.addClass(CLASS_COURIER);
}

/**
 * Adds an edge between two nodes in the network
 * @param {String} sourceNode The source node of the edge
 * @param {String} targetNode The target node of the edge
 * @param {Boolean} isOneWay Whether the edge is only traversible one way (true) or not (false)
 */
function addEdge (sourceNode, targetNode, isOneWay = false) {
  cy.add({
    group: 'edges',
    data: { 
      source: sourceNode,
      target: targetNode,
      id:     sourceNode+targetNode,
      oneway: isOneWay
    },
  });
  calcLength (sourceNode+targetNode);
}

/** Initialises length for all edges */
function initLength () {
  let edges = cy.edges(),
      n = edges.n;
  for (let i = 0; i < n; i++) {
    calcLength(edges[i].id());
  }
}

/**
 * Initialises names for all edges.
 * Since the id property of an edge is immutable,
 * a new edge is created with the correct ID and
 * the old edge is removed.
 */
function initNames () {
  let edges = cy.edges(),
      n = edges.length;
  for (let i = 0; i < n; i++) {
    addEdge (edges[i].data("source"), edges[i].data("target"));
    addEdge (edges[i].data("target"), edges[i].data("source"));
    delNode(edges[i].id());
  }
}

/**
 * Calculates the length of a specific edge using Pythagora's theorem
 * @param {String} edgeId The ID of the edge to calculate the length of
 * @returns The length of the edge
 */
function calcLength (edgeId) {
  let edge = cy.$id(edgeId),
      pos1 = getPos(edge.data("source")),
      pos2 = getPos(edge.data("target")),
      length = Math.sqrt((pos2.x- pos1.x)*(pos2.x-pos1.x)+(pos2.y-pos1.y)*(pos2.y-pos1.y)); 

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
function getLength (sourceNode, targetNode, ignoreDirection = false) {
  let edges = cy.$id(sourceNode).connectedEdges(),
      n = edges.length;
  for(let i = 0; i < n; i++) {
    if(edges[i].data("target") === targetNode || (ignoreDirection && edges[i].data("source") === targetNode)) {
      return edges[i].data("length");
    }
  }
}

/**
 * Gets the position (x, y) of an element
 * @param {String} nodeId The ID of the element to inspect
 * @returns The position (x, y) of the element
 */
function getPos (nodeId) {
  return cy.$id(nodeId)["_private"].position
}

/**
 * Choose random integer between 0 and max
 * @param {Number} max The maximum integer to return
 * @returns The random integer
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Uses Dijkstra's algorithm to find the shortest path between a start and end node.
 * @param {String} courierId The ID of the courier.
 * @param {String} EndId The ID of the destination.
 */
function traversePath (courierId, endId) {
  let courierPos = cy.$id(courierId).data("currentNode");
  dijkstra(cy.elements(), cy.$id(courierPos));
  let path = traceback (cy.elements(), cy.$id(endId));
  animateCourier (path, courierId);
}

/**
 * Animates the movement of a courier from point A to B, highlighting the route.
 * @param {Array} path The array of nodes produced by a pathfinding algorithm
 * @param {String} courierId The ID of the courier to animate
 * @param {Number} index The index to start from (default: 0) 
 */
function animateCourier (path, courierId, index = 0) {
  let diff1 = getPos(path[index + 1]).x - getPos(path[index]).x,
      diff2 = getPos(path[index + 1]).y - getPos(path[index]).y,
      edge = cy.$id(path[index] + path[index + 1]),
      edgeRev = cy.$id(path[index + 1] + path[index]),
      steps = getLength(path[index], path[index + 1])*2,
      courier = cy.$id(courierId),
      i = 0;
  edge.addClass("route");
  edgeRev.addClass("route");
  let anim = setInterval( () => {
      courier.shift({x: diff1/steps, y: diff2/steps});
      i++;
      if (i >= steps) {
          clearInterval(anim);
          edge.addClass(CLASS_ROUTE_DONE);
          edgeRev.addClass(CLASS_ROUTE_DONE)
          setTimeout( () => {
            edge.removeClass(CLASS_ROUTE + " " + CLASS_ROUTE_DONE);
            edgeRev.removeClass(CLASS_ROUTE + " " + CLASS_ROUTE_DONE);
            courier.data("currentNode", path[index + 1]);
            if (index + 1 < path.length - 1) {
              console.log(courier.id() + " went through " + courier.data("currentNode"));
              return animateCourier (path, courierId, index + 1);
            }
            else {
              console.log(courier.id() + " arrived at " + courier.data("currentNode"));
              return;
            }
          }, 250);
      }
  }, 10);
}

// Unused functions

/**
 * Selects a random position in the map
 * @returns The coordinates of the random position
 */
 function getRandomPos() {
  let pos = {    
    x: getRandomInt(Viewport.width)-(Viewport.width/2),
    y: getRandomInt(Viewport.height)-(Viewport.height/2)  
  };
  return pos;
}

/** Prints the nodes of the network as well as their connected edges */
function listNetwork () {
  let nodes = cy.nodes(),
      netStr = "";
  
  for (let i = 0; i < nodes.length; i++) {
    netStr += ("Node: " + nodes[i].id() + "\n")
    if (nodes[i].connectedEdges().length) {
      for (let j = 0; j < nodes[i].connectedEdges().length; j++) {
        netStr += ("Connected edge: " + nodes[i].connectedEdges()[j].id() + "\n");
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
function moveNode (nodeId, xCoord, yCoord) {
  cy.$id(nodeId).relativePosition({
    x: xCoord,
    y: yCoord
  });
}

/* WIP: Generate random customers in the network
let numCustomers = 0;
function generateCustomer() {
  let maxNodeDistance = 100, // global variable?
      randPos = getRandomPos(),
      nodes = cy.nodes(),
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