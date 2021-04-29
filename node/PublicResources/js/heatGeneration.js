import { dijkstra } from "./dijkstra.js";
import { eleType } from "./graphHelper.js";
import { orderIntensity, timeToFloat } from "./orderGeneration.js";
export { generateHeatmap };

let graphRadius = null;
/**
 * Gets the graph 'radius', which is the average edge weight of the graph
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @returns The graph radius
 */
function getGraphRadius(cyGraph) {
  if (graphRadius) {
      return graphRadius;
  }
  let edges = cyGraph.graph.edges(),
      totalWeight = 0;
  for (const edge of edges) {
    totalWeight += edge.data("weight");
  }
  graphRadius = totalWeight / edges.length;
  return graphRadius;
}

/**
 * Generates a heat map based on restaurant order activity, and finds/assigns appropriate idle-zones
 * @param {Object} cyGraph The graph the simulation is contained within.
 */
function generateHeatmap(cyGraph) {
  resetHeat(cyGraph);
  cyGraph.idleZones = [];

  //Assign appropriate heat values to all regular nodes
  assignHeat(cyGraph);

  //Find n waiting zones
  let n = getZoneCount(cyGraph);
  for (let i = 0; i < n; i++) {
    let zone = findIdleZone(cyGraph);
    cyGraph.idleZones.push(zone);
    // Update the heat of surrounding nodes
    updateHeat(cyGraph, zone);
  }
  //Color the nodes in the graph
  updateColors(cyGraph);
}

/**
 * Calculates a number of idle zones based on the number of restaurants and couriers
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @returns The amount of idle zones to assign (based on restaurants pr courier).
 */
function getZoneCount(cyGraph) {
  return Math.ceil(cyGraph.restaurants.length/2);
}

/**
 * Sets the heat of all nodes in the graph to 0
 * @param {Object} cyGraph The graph the simulation is contained within.
 */
function resetHeat(cyGraph) {
  for (let node of cyGraph.graph.nodes()) {
    node.data("heat", 0);
  }
}

/**
 * Calculates a heat property for all nodes in a specific radius of each restaurant
 * @param {Object} cyGraph The graph the simulation is contained within.
 */
function assignHeat(cyGraph) {
  let radius = 3*getGraphRadius(cyGraph);
  for (const restaurant of cyGraph.restaurants) {
    dijkstra(cyGraph, restaurant);
    let closeNodes = findNodesInRadius(cyGraph, restaurant, radius);
    for (const node of closeNodes) {
      let oldVal = node.data("heat");
      let intensity = orderIntensity(
        timeToFloat(cyGraph.timeMinutes),
        restaurant.intensityFunc
      );
      node.data("heat", oldVal + restaurant.data("orderRate") * intensity);
    }
  }
}

/**
 * Finds the current best idle zone in the graph
 * @param {Object} cyGraph
 * @returns The 'warmest' node (read: best idle zone)
 */
function findIdleZone(cyGraph) {
  let sortedNodes = cyGraph.graph
    .nodes()
    .filter((n) => isRegNode(n))
    .sort((a, b) => {
      let heatA = a.data("heat");
      let heatB = b.data("heat");
      return heatB - heatA;
    });
  // Skip all nodes that are already idle-zones
  // Since the array of nodes is sorted, the first available node will be the 'best'
  let i = 0;
  while (isIdleZone(sortedNodes[i], cyGraph)) {
    i++;
  }
  return sortedNodes[i];
}

/**
 * Reduces heat of nodes in a radius around the input idle zone node
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @param {Object} zone The node around which heat should be updated.
 */
function updateHeat(cyGraph, zone) {
  let closeNodes = findNodesInRadius(cyGraph, zone, getGraphRadius(cyGraph));
  for (let node of closeNodes) {
    let oldVal = node.data("heat");
    node.data("heat", oldVal * 0.6); //? reduce the heat of each closely connected node by 1 - 0.6 = 40%
  }
}

/**
 * Colors the graph based on heat values.
 * @param {Object} cyGraph The graph the simulation is contained within.
 */
function updateColors(cyGraph) {
  let warmNodes = cyGraph.graph
    .nodes()
    .filter((n) => isRegNode(n) && n.data("heat") > 0); //? only color regular nodes with a heat value above 0
  // Find the maximum heat in the graph
  let max = 0;
  for (const node of warmNodes) {
    let heat = node.data("heat");
    if (heat > max) {
      max = heat;
    }
  }

  // Set color based on the max heat. Idle-zones are red per default
  for (let node of warmNodes) {
    node.removeClass(
      `${eleType.idlezone_red} ${eleType.idlezone_orange} ${eleType.idlezone_yellow}`
    );

    if (isIdleZone(node, cyGraph)) {
      node.addClass(eleType.idlezone_red);
    } else if (node.data("heat") > max * 0.33) { //? if the heat value is within 77% of the max heat
      node.addClass(eleType.idlezone_orange);
    } else {
      node.addClass(eleType.idlezone_yellow);
    }
  }
}

/**
 * Determines whether a given node is currently an idle-zone
 * @param {Object} node the node to check
 * @param {Object} cyGraph the graph the node is present on
 * @returns True if the node in question is an idle-zone, false if not
 */
function isIdleZone(node, cyGraph) {
  return cyGraph.idleZones.indexOf(node) > -1 ? true : false;
}

/**
 * Determines whether a node is regular (read: not a restaurant or courier)
 * @param {Object} n The node to check
 * @returns True if the node is regular, false otherwise
 */
function isRegNode(n) {
  let firstChar = n.id().charAt(0);
  return firstChar !== "c" && firstChar !== "R";
}

/**
 * Finds all nodes in a radius around the given startNode.
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @param {Object} startNode The center of the selection circle
 * @param {Number} radius The radius of the circle.
 * @returns An array of nodes in circle centered on 'startNode' with the radius 'radius'.
 */
function findNodesInRadius(cyGraph, startNode, radius) {
  let nodes = cyGraph.graph.nodes().filter((n) => isRegNode(n));
  let nodesInRadius = [];
  dijkstra(cyGraph, startNode);
  for (const node of nodes) {
    if (node !== startNode && node.data("distanceOrigin") <= radius) {
      nodesInRadius.push(node);
    }
  }
  return nodesInRadius;
}