import { dijkstra } from "./dijkstra.js";
import { generateHeatmap, generateObstructions } from "./heatGeneration.js";
import { eleType } from "./graphHelper.js";
import { updateStats, updateTimeOnly } from "./stats.js";
export {
  startSimulation,
  timeToFloat,
  orderIntensity,
  formatTime,
  assignCourier,
  Order,
};

const isHeadless = document.querySelector("div.headless");
const END_DAY = 0; // 0 if endless simulation, otherwise simulation stops on the set day.
const SHOULD_RESTART = false; // if END_DAY is configured, controls whether or not the simulation should loop.
/**
 * Starts the order generation simulation
 * @param {Class} cyGraph The graph the simulation is contained within.
 * @param {Number} tickDuration the time (in ms) per tick.
 * @returns The update interval.
 */
function startSimulation(cyGraph, tickDuration) {
  let n = cyGraph.restaurants.length;
  for (let i = 0; i < n; i++) {
    if (i < Math.ceil(n / 2)) {
      // Set half of restaurants to be lunch intensive
      cyGraph.restaurants[i].intensityFunc = lunchRate;
      cyGraph.restaurants[i].addClass(eleType.lunch);
    } else {
      // The rest should be dinner intensive
      cyGraph.restaurants[i].intensityFunc = dinnerRate;
      cyGraph.restaurants[i].addClass(eleType.dinner);
    }
  }
  return setInterval(() => perTick(cyGraph), tickDuration);
}

/**
 * Handles the simulation time, and all actions that should be performed at specific times or intervals.
 * @param {Class} cyGraph The graph the simulation is contained within.
 */
function perTick(cyGraph) {
  if (cyGraph.simulationStats.simDays == END_DAY) {
    stopSimulation(cyGraph);
    if (SHOULD_RESTART) {
      restartSimulation(cyGraph);
    }
  }

  cyGraph.timeMinutes++;

  if (cyGraph.timeMinutes == 1440) {
    cyGraph.simulationStats.failedOrders += cyGraph.orders.length;
    cyGraph.simulationStats.activeOrders = 0;
    for (let order of cyGraph.orders) {
      order.status = "failed";
      order.endTime = cyGraph.timeMinutes;
      order.endTimeClock = formatTime(order.endTime);
      cyGraph.simulationStats.timedOutOrders++;
    }
    cyGraph.orders = new Array();
    cyGraph.timeMinutes = 0;
    cyGraph.simulationStats.simDays++;
  }

  cyGraph.simulationStats.simtimeMinutes = cyGraph.timeMinutes;
  cyGraph.simulationStats.simTime = formatTime(cyGraph.timeMinutes);

  // Handle order generation every 5 ticks
  if (!(cyGraph.timeMinutes % 5)) {
    cyGraph.simulationStats.calcRuntime(); // Stat: Calculates the amount of real-world time has passed
    cyGraph.simulationStats.activeOrders = // Stat: keeps track of the current amount of orders both in waiting and actively being delivered
      cyGraph.simulationStats.totalOrdersArr.length -
      cyGraph.simulationStats.deliveredOrdersArr.length -
      cyGraph.simulationStats.timedOutOrders;
    if (isHeadless) {
      updateStats(cyGraph.simulationStats); // Updates all statistics
    } else {
      updateTimeOnly(cyGraph.simulationStats);
    }
    generateOrders(cyGraph);
  }

  // Generate idle zones and update the courier amount every 60 ticks
  if (!(cyGraph.timeMinutes % 60)) {
    if (cyGraph.simulationStats.deliveredOrdersArr.length) {
      cyGraph.simulationStats.avgDeliveryTime();
    }
    if (!(cyGraph.timeMinutes % 180)) {
      generateObstructions(cyGraph);
    }
    if (
      cyGraph.idleZoneAmount &&
      cyGraph.timeMinutes >= 480 &&
      cyGraph.timeMinutes < 1260
    ) {
      generateHeatmap(cyGraph);
    }
    maintainCouriers(cyGraph);
  }

  if (!(cyGraph.timeMinutes % 2)) {
    for (let i = 0; i < cyGraph.couriers.length; i++) {
      if (cyGraph.orders[i]) {
        assignCourier(cyGraph, cyGraph.orders[i], i);
      }
    }
  }
}

/**
 * Ensures that the number of couriers is set according to expected values for each hour
 * @param {Class} cyGraph The graph the simulation is contained within.
 */
function maintainCouriers(cyGraph) {
  // The expectedCourierMultiplier array denotes the courier multiplier of each hour of the day (starting at 00:00)
  let expectedCourierMultiplier = [
    0.0, // 00
    0.0, // 01
    0.0, // 02
    0.0, // 03
    0.0, // 04
    0.0, // 05
    0.0, // 06
    0.0, // 07
    0.2, // 08
    0.3, // 09
    0.3, // 10
    0.6, // 11
    0.6, // 12
    0.4, // 13
    0.4, // 14
    0.4, // 15
    0.6, // 16
    0.7, // 17
    1.0, // 18
    1.0, // 19
    0.6, // 20
    0.4, // 21
    0.0, // 22
    0.0, // 23
  ];
  let curHour = Math.floor(cyGraph.timeMinutes / 60);
  let expectedCourierCount = Math.ceil(
    cyGraph.courierFreq * expectedCourierMultiplier[curHour]
  ); // Number of couriers = max * multiplier
  let courierCount = cyGraph.couriers.length;

  // If the amount of couriers is too high, try to 'send some of them home'
  if (courierCount > expectedCourierCount) {
    let index = 0;
    while (courierCount > expectedCourierCount && index < courierCount) {
      let currentCourier = cyGraph.couriers[index];
      // If the current courier has an order, immediately remove it from the courier array
      // but only remove the node after all its orders have been delivered
      if (
        currentCourier.data("currentOrder") ||
        currentCourier.data("pendingOrder")
      ) {
        currentCourier.data("terminationImminent", true);
        cyGraph.couriers.splice(index, 1);
        courierCount--;
      }
      // Otherwise, if the courier has no orders, simply remove it
      else {
        cyGraph.couriers.splice(index, 1);
        cyGraph.delNode(currentCourier.id());
        courierCount--;
      }
    }
  }
  // In the other case, there are too few couriers, so simply add the missing number of couriers
  else {
    for (courierCount; courierCount < expectedCourierCount; courierCount++) {
      cyGraph.addCourier();
    }
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
 * @param {Function} func The function to provide return value of input x for.
 * @returns The order intensity based on predefined restaurant rush-hour spikes (piecewise equations).
 */
function orderIntensity(x, func) {
  return func(x);
}

/**
 * Determines current intensity (business) of restaurants for order generation
 * @param {Number} x The current minutes to the hour as a float.
 * @returns The order intensity
 */
function lunchRate(x) {
  if (x >= 8 && x < 15) {
    return (Math.sin(0.86 * x - 2.3) + 1) / 2;
  } else if (x >= 15 && x < 21) {
    return Math.sin(0.5 * x + 5.2) / 2;
  } else {
    return 0;
  }
}

/**
 * Determines current intensity (business) of restaurants for order generation
 * @param {Number} x The current minutes to the hour as a float.
 * @returns The order intensity
 */
function dinnerRate(x) {
  if (x >= 8 && x < 15) {
    return Math.sin(0.43 * x + 2.9) / 2;
  } else if (x >= 15 && x < 21) {
    return (Math.sin(0.95 * x - 3.5) + 1) / 2;
  } else {
    return 0;
  }
}

/**
 * Generates an order from a random restaurant to a random customer in the network based on the current intensity and some randomness.
 * @param {Class} cyGraph The graph the simulation is contained within.
 * @returns The new order.
 */
function generateOrders(cyGraph) {
  for (const restaurant of cyGraph.restaurants) {
    let intensity = orderIntensity(
      timeToFloat(cyGraph.timeMinutes),
      restaurant.intensityFunc
    );
    let roll = Math.random();
    if (roll <= restaurant.data("orderRate") * intensity) {
      let i = cyGraph.getRandomInt(cyGraph.customers.length - 1);
      let order = new Order(
        cyGraph.simulationStats.totalOrdersArr.length + 1,
        restaurant,
        cyGraph.customers[i],
        cyGraph.timeMinutes
      );
      cyGraph.orders.push(order);
      cyGraph.simulationStats.totalOrdersArr.push(order); // Stat: pushes the new order to the array of total orders
      cyGraph.simulationStats.pendingOrders = cyGraph.orders.length; // Stat: keeps track of the current amount of orders waiting to be picked up
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
  this.startTimeClock = formatTime(startTime);
  this.assignedCourier = "";
  this.status = "pending";
}

/**
 * Assigns and dispatches a courier to the given order.
 * @param {Class} cyGraph The cyGraph to perform the assignment on.
 * @param {Object} order The order to be assigned.
 * @param {Number} index The index of the order in the CyGraph's order array.
 */
function assignCourier(cyGraph, order, index) {
  let courier = findCourier(cyGraph, order);
  if (courier) {
    courier.data("currentOrder", order);
    order.assignedCourier =
      courier.id(); /* Used to print the assigned courier of an order only using an array of orders*/
    if (courier.data("moving")) {
      courier.data("pendingOrder", true);
    } else {
      cyGraph.traversePath(courier.id(), order.restaurant.id());
    }
    cyGraph.orders.splice(index, 1);
    cyGraph.simulationStats.pendingOrders = cyGraph.orders.length; // Stat: Updates the amount of waiting orders after an order starts being delivered
  }
}

/**
 * Searches the given graph for a courier that is closest to the origin of a given order.
 * @param {Class} cyGraph The cyGraph to perform the search on.
 * @param {Object} order The order to find a courier for.
 * @returns The best courier of all candidates, or null no none are found.
 */
function findCourier(cyGraph, order) {
  let availableCouriers = new Array();
  let lowestDistance = Infinity;
  let bestCourier = null;
  dijkstra(cyGraph, order.restaurant);
  for (const courier of cyGraph.couriers) {
    if (!courier.data("currentOrder")) {
      availableCouriers.push(courier);
    }
  }
  for (const courier of availableCouriers) {
    let curNode = courier.data("currentNode"),
      curDistOrigin = curNode.data("distanceOrigin");
    if (curDistOrigin < lowestDistance) {
      lowestDistance = curDistOrigin;
      bestCourier = courier;
    }
  }
  return bestCourier;
}

/**
 * Stops the simulation, logging stats in the console.
 * @param {Class} cyGraph The simulation object.
 */
function stopSimulation(cyGraph) {
  clearInterval(cyGraph.simHandler);
  console.log(
    "[" +
      cyGraph.name +
      "] Simulation #" +
      cyGraph.numSimulations +
      " - Results on day " +
      END_DAY +
      ": \n" +
      "Total orders: " +
      cyGraph.simulationStats.totalOrdersArr.length +
      "\n" +
      "Failed orders: " +
      cyGraph.simulationStats.failedOrders +
      "\n" +
      "Success rate: " +
      (
        (1 -
          cyGraph.simulationStats.failedOrders /
            cyGraph.simulationStats.totalOrdersArr.length) *
        100
      ).toFixed(2) +
      "%\n" +
      "Average delivery time: " +
      cyGraph.simulationStats.averageDeliveryTime.toFixed(2) +
      " minutes"
  );
}

/**
 * Restarts the simulation, allowing for endless loops of a certain amount of simulation days.
 * @param {Class} cyGraph The simulation object.
 */
function restartSimulation(cyGraph) {
  cyGraph.numSimulations++;
  cyGraph.reset();
  cyGraph.simHandler = startSimulation(cyGraph, cyGraph.tickDuration);
}
