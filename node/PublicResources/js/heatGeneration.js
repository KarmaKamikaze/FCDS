import { dijkstra } from "./dijkstra.js";
import { eleType } from "./graphHelper.js";
import { orderIntensity, timeToFloat } from "./orderGeneration.js";

let idleZones = [];

/** Returns a number of idle zones to create, based on the no. of couriers */
function getIdleZoneCount() {
  return 2;
}

function BIGGUS_DICKUS(cyGraph, timeMinutes) {
  let regNodes = cyGraph.graph.nodes().filter((n) => isRegularNode(n));
  idleZones = [];
  resetHeat(regNodes);
  generateHeat(cyGraph, timeMinutes); // runs dijkstra for each restaurant
  for (let i = 0; i < getIdleZoneCount(); i++) {
    // First sort the array of regular nodes by their sumDist property (increasing order)
    regNodes = regNodes.sort((a, b) => b.data("sumDist") - a.data("sumDist"));
    // Then push the i'th idle zone into the idle zone array
    idleZones.push(regNodes[0]);
    regNodes.splice(0, 1); // and remove the idle zone from the regNodes array
    // Finally, update the heat around the idle zone
    UpdateHeat(cyGraph, regNodes, i); // runs dijkstra for each idle zone
  }
  // Now we can update the graph nodes visually
  setNodeColors(cyGraph.graph.nodes());
}

function resetHeat(regNodes) {
  for (let node of regNodes) {
    node.data("sumDist", 0.0);
  }
}

function generateHeat(cyGraph, timeMinutes) {
  let R = cyGraph.restaurants,
    Rn = R.length;
  let N = cyGraph.graph.nodes().filter((n) => isRegularNode(n)),
    Nn = N.length;
  for (let i = 0; i < Rn; i++) {
    let Pr = 100 * R[i].data("orderRate");
    dijkstra(cyGraph, R[i]);
    // Apply the sum formula
    for (let j = 0; j < Nn; j++) {
      let prevVal = N[j].data("sumDist"),
        T = Pr / N[j].data("distanceOrigin");
      N[j].data("sumDist", prevVal + T);
    }
  }
}

function UpdateHeat(cyGraph, regNodes, i) {
  // get distance from idleZone[i] to all other nodes
  dijkstra(cyGraph, idleZones[i]);
  let radius = getIdleZoneRadius(regNodes);

  // save only the directly connected nodes
  /*   let closeNodes = idleZones[i]
    .openNeighborhood()
    .filter((n) => isRegularNode(n));
  for (let node of closeNodes) {
    if (node.data("distanceOrigin") < radius) {
      let newVal = node.data("sumDist") - radius;
      node.data("sumDist", newVal);
      console.log(
        `[${idleZones[i].id()}]: Updated the heat of node ${node.id()}`
      );
    }
  } */

  for (const node of regNodes) {
    if (node.data("distanceOrigin") < radius) {
      let newVal = node.data("sumDist") - radius / 10000;
      node.data("sumDist", newVal);
      console.log(
        `[${idleZones[i].id()}]: Updated the heat of node ${node.id()}`
      );
    }
  }

  // The heat should now be updated
}

function getIdleZoneRadius(nodes) {
  let sum = 0;
  for (const node of nodes) {
    sum += node.data("distanceOrigin");
  }
  let avg = sum / nodes.length;
  return avg / 4; // the radius is 1/4 of the avg distance
}

/** Returns true if the input node is a regular node (i.e., not a restaurant or courier node) */
function isRegularNode(node) {
  let firstChar = node.id().charAt(0);
  return firstChar !== "R" && firstChar !== "c";
}

function setNodeColors(nodes) {
  // Reset all colors and make them yellow!
  for (let node of nodes) {
    node.toggleClass(eleType.idlezone_red, false);
    node.toggleClass(eleType.idlezone_orange, false);
    node.toggleClass(eleType.idlezone_yellow, true);
  }

  // Apply red to idle zones
  for (let idleZone of idleZones) {
    idleZone.toggleClass(eleType.idlezone_red, true);
    idleZone.toggleClass(eleType.idlezone_orange, false);
    idleZone.toggleClass(eleType.idlezone_yellow, false);
  }
}

export { BIGGUS_DICKUS };
