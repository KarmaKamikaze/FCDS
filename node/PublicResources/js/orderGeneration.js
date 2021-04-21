import { dijkstra } from "./dijkstra.js";

let timeMinutes = 480; // start at 8:00

/**
 * Starts the order generation simulation
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @param {integer} tickSpeed the time (in ms) per tick.
 * @returns The update interval.
 */
function startSimulation(cyGraph, tickSpeed) {
  return setInterval(() => perTick(cyGraph), tickSpeed);
}

/**
 * Assigns the time throughout the simulation.
 * @param {Object} cyGraph The graph the simulation is contained within.
 */
function perTick(cyGraph) {
  timeMinutes++;

  if (timeMinutes == 1440) {
    timeMinutes = 0;
    cyGraph.simulationStats.simDays++;
  }

  /* Can be placed within the if-statement underneath incase 
     it takes too much computational time. */
  cyGraph.simulationStats.simTimeMinutes = timeMinutes;
  cyGraph.simulationStats.simTime = formatTime(timeMinutes);

  if (!(timeMinutes % 5)) {
    console.log(formatTime(timeMinutes));
    generateOrders(cyGraph, timeMinutes);
  }

  for (let i = 0; i < cyGraph.orders.length; i++) {
    assignCourier(cyGraph, cyGraph.orders[i], i);
  }
}

/**
 * Converts the current amount of minutes to a float
 * @param {Number} currentMinute The current amount of minutes to the hour.
 * @returns The minutes as a float
 */
function timeToFloat(currentMinute) {
  return currentMinute / 60;
}

/**
 * Prints the current time.
 * @param {Number} timeMinutes The current simulation time in minutes.
 * @returns The time as a string.
 */
function formatTime(timeMinutes) {
  let string = Math.floor(timeMinutes / 60);
  let minute = timeMinutes % 60;
  string += ":";
  string += minute >= 10 ? minute : "0" + minute;
  return string;
}

/**
 * Determines the intensity in the amount of orders generated every hour.
 * @param {Number} x The current minutes to the hour as a float.
 * @returns The order intensity based on predefined restaurant rush-hour spikes (piecewise equations).
 */
function orderIntensity(x) {
  if (x >= 8 && x < 15) {
    return (Math.sin(0.86 * x - 2.3) + 1) / 2;
  } else if (x >= 15 && x < 21) {
    return Math.abs(Math.sin(0.5 * x + 2.07)) / 2;
  } else {
    return 0;
  }
}

/**
 * Creates a random number in an interval.
 * @param {Number} min The lower bound of the interval.
 * @param {Number} max The upper bound of the interval.
 * @returns A number between min and max.
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generates an order from a random restaurant to a random customer in the network based on the current intensity and some randomness.
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @param {Number} time The current minutes to the hour.
 * @returns The new order.
 */

function generateOrders(cyGraph, timeMinutes) {
  let intensity = orderIntensity(timeToFloat(timeMinutes));

  for (const restaurant of cyGraph.restaurants) {
    let roll = Math.random();
    if (roll <= restaurant.data("orderRate") * intensity) {
      let i = getRandomInt(0, cyGraph.customers.length - 1);
      let order = new Order(
        ++cyGraph.simulationStats.totalOrders,
        restaurant,
        cyGraph.customers[i],
        timeMinutes
      );
      cyGraph.orders.push(order);
      cyGraph.simulationStats.pendingOrders = cyGraph.orders.length;
      cyGraph.simulationStats.activeOrders =
        cyGraph.simulationStats.totalOrders -
        cyGraph.simulationStats.deliveredOrders;
    }
  }
}

/**
 * The Order object.
 * @param {Number} id The order number.
 * @param {Number} origin The restaurant the order is placed at.
 * @param {Number} destination The customer the order is to be delivered to.
 * @param {Number} startTime The time at which the order was placed.
 */
function Order(id, origin, destination, startTime) {
  this.id = id;
  this.restaurant = origin;
  this.customer = destination;
  this.maxDuration = 60;
  this.startTime = startTime;
}

/**
 * Assigns and dispatches a courier to the given order.
 * @param {CyGraph} cyGraph The cyGraph to perform the assignment on.
 * @param {Object} order The order to be assigned.
 * @param {Number} index The index of the order in the CyGraph's order array.
 */
function assignCourier(cyGraph, order, index) {
  let courier = findCourier(cyGraph, order);
  if (courier) {
    console.log(
      `Graph: [${cyGraph.name}] - Order: [${
        order.id
      }] - Route: [${courier.id()}] -> [${order.restaurant.id()}] -> [${order.customer.id()}]`
    );
    courier.data("currentOrder", order);
    cyGraph.traversePath(courier.id(), order.restaurant.id());
    cyGraph.orders.splice(index, 1);
    cyGraph.simulationStats.pendingOrders = cyGraph.orders.length;
  }
}

/**
 * Searches the given graph for a courier that is closest to the origin of a given order.
 * @param {CyGraph} cyGraph The cyGraph to perform the search on.
 * @param {Object} order The order to find a courier for.
 * @returns The best courier of all candidates, or null no none are found.
 */
function findCourier(cyGraph, order) {
  let connectedNodes = order.restaurant.openNeighborhood((elem) =>
    elem.isNode()
  );
  let visitedNodes = new Array();
  let closeCouriers = new Array();
  let nodeSet = new Set(connectedNodes);
  let attempts = 0;
  let shortestLength = Infinity;
  let bestCourier = null;

  // If the order restaurant already has an available courier, return it
  for (const courier of order.restaurant.couriers) {
    if (!courier.data("currentOrder") === null) return courier;
  }

  // Otherwise search through connected nodes, starting at the order restaurant, and search for couriers
  while (closeCouriers.length < 3 && attempts < 10) {
    for (const node of connectedNodes) {
      nodeSet.add(node);
    }

    // Remove any nodes that were previously examined
    for (const node of visitedNodes) {
      nodeSet.delete(node);
    }

    // If there is an available courier at any node in the set (so far), add it to the closeCouriers array
    for (const item of nodeSet) {
      if (
        item.couriers.length &&
        item.couriers[0].data("currentOrder") == null
      ) {
        closeCouriers.push(item.couriers[0]);
      }
    }

    // Note completion of attempt, update visitedNodes and connectedNodes
    attempts++;
    visitedNodes = [...visitedNodes, ...connectedNodes];
    connectedNodes = connectedNodes.openNeighborhood((elem) => elem.isNode());
  }

  // As a final step, find and return the courier with the shortest distance to the restaurant (using dijkstra's algorithm)
  for (const courier of closeCouriers) {
    dijkstra(cyGraph, cyGraph.graph.$id(courier.data("currentNode")));
    let length = order.restaurant.data("distanceOrigin");
    if (length < shortestLength) {
      shortestLength = length;
      bestCourier = courier;
    }
  }
  return bestCourier;
}

export { startSimulation };
