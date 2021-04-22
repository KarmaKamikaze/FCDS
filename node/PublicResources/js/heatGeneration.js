import { dijkstra } from "./dijkstra.js";
import { eleType } from "./graphHelper.js";
import { orderIntensity, timeToFloat } from "./orderGeneration.js";

/**
 * Generates a heat map based on restaurant order activity, and finds/assigns appropriate idle-zones
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @param {Number} timeMinutes The current time in minutes since the simulation began.
 */
function generateHeatmap(cyGraph, timeMinutes) {
  resetHeat(cyGraph);
  cyGraph.idleZones = [];

  //Assign appropriate heat values to all regular nodes
  assignHeat(cyGraph, timeMinutes);

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

/** //TODO: should probably put more thought into the formula
 * Calculates a number of idle zones based on the number of restaurants and couriers
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @returns The amount of idle zones to assign (based on restaurants pr courier).
 */
function getZoneCount(cyGraph) {
  return Math.floor(cyGraph.restaurants.length / cyGraph.couriers.length);
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
 * @param {Number} timeMinutes The current time in minutes since the simulation began.
 */
function assignHeat(cyGraph, timeMinutes) {
  let radius = 1000; //TODO: make a formula for the radius (i.e., based on avg edge length?)
  for (const restaurant of cyGraph.restaurants) {
    dijkstra(cyGraph, restaurant);
    let closeNodes = findNodesInRadius(cyGraph, restaurant, radius);
    for (const node of closeNodes) {
      let oldVal = node.data("heat");
      let intensity = orderIntensity(
        timeToFloat(timeMinutes),
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
  let i = 0;
  while (isIdleZone(sortedNodes[i], cyGraph)) {
    i++;
  }
  return sortedNodes[i];
}

/**
 * Reduces heat around a node
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @param {Object} zone The node around which heat should be updated.
 */
function updateHeat(cyGraph, zone) {
  let closeNodes = findNodesInRadius(cyGraph, zone, 500);
  for (let node of closeNodes) {
    let oldVal = node.data("heat");
    node.data("heat", oldVal * 0.6); //? reduce the heat of each closely connected node by 40%
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

    if (isIdleZone(node)) {
      node.addClass(eleType.idlezone_red);
    } else if (node.data("heat") > max * 0.33) {
      node.addClass(eleType.idlezone_orange);
    } else {
      node.addClass(eleType.idlezone_yellow);
    }
  }
}

/**
 * Determines whether a given node is currently an idle-zone
 * @param {Object} node the node to check
 * @returns True if the node in question is an idle-zone, false if not
 */
function isIdleZone(node, cyGraph) {
  return cyGraph.idleZones.indexOf(node) > -1 ? true : false;
}

/**
 * Determines whether a node is regular (read: not a restaurant or courier)
 * @param {Object} n The node to check
 * @returns True or false, depending on if node is regular or not
 */
function isRegNode(n) {
  let firstChar = n.id().charAt(0);
  return firstChar !== "c" && firstChar !== "R";
}

/**
 *
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

export { generateHeatmap };
