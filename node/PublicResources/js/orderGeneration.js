import { dijkstra } from "./dijkstra.js";
import { traceback } from "./pathModules.js";

let timeMinutes = 480; // start at 8:00
//let orders = [];

/**
 * Starts the order generation simulation
 * @param {Object} cyGraph The graph the simulation is contained within.
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
    // clearInterval(timeTrack);
  }
  let order = generateOrder(cyGraph, timeMinutes);
  if (order) {
    cyGraph.orders.push(order);
    // assignCourierIter(cyGraph, order);
  }

  for (let i = 0; i < cyGraph.orders.length; i++) {
    assignCourierIter(cyGraph, cyGraph.orders[i], i);
  }
  cyGraph.sortOrders();


  //console.log(cyGraph.orders.length);
  //console.log("Time: " + printTime(timeMinutes));
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
 * @param {Number} timeMinutes The current total amount of minutes.
 * @returns The time as a string.
 */
function printTime(timeMinutes) {
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
    return Math.sin(0.86 * x - 2) + 1;
  } else if (x >= 15 && x < 21) {
    return Math.abs(Math.sin(0.5 * x + 2));
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
let ass = 0;
function generateOrder(cyGraph, timeMinutes) {
  let orderWt = orderIntensity(timeToFloat(timeMinutes));

  if (orderWt) {
    let roll = orderWt + getRandomInt(0, 10);
    if (roll > 9) {
      let i = getRandomInt(0, cyGraph.restaurants.length - 1),
        j = getRandomInt(0, cyGraph.customers.length - 1);
      return new Order(++ass, cyGraph.restaurants[i], cyGraph.customers[j], timeMinutes); // return an order with a random origin and destination.
    }
  }
}

/**
 * The Order object.
 * @param {Number} origin The restaurant the order is placed at.
 * @param {Number} destination The customer the order is to be delivered to.
 * @param {Number} startTime The time at which the order was placed.
 */
function Order(id, origin, destination, startTime) {
  this.id = id;
  this.restaurant = origin;
  this.customer = destination;
  this.maxDuration = 60;
  this.hasAllergens = Math.random() > 0.95;
  this.startTime = startTime;
}

/**
 * Assigns the best courier to the new order. 
 * @param {Object} cyGraph The graph the simulation is contained within.
 * @param {Object} order The order to be assigned
 */
function assignCourierIter(cyGraph, order, index) {
  let radius = Infinity;
  let closeCouriers = [];
  let lowestDist = Infinity;
  let bestCourier = null;

  let n = cyGraph.couriers.length;
  for (let i = 0; i < n; i++) {
    let courier = cyGraph.couriers[i];
    if (courier.data("currentOrder")) continue;
    let distRest = Math.hypot(
      order.restaurant.position().x - courier.position().x,
      order.restaurant.position().y - courier.position().y
    );
    if (distRest < radius) {
      closeCouriers.push(courier);
    }
  }

  if (closeCouriers.length === 0) {
    console.warn(`could not assign a courier to order ${order.id}`);
  }

  n = closeCouriers.length;
  for (let i = 0; i < n; i++) {
    let courier = closeCouriers[i];
    dijkstra(cyGraph.graph, cyGraph.graph.$id(courier.data("currentNode")));
    let length = order.restaurant.data("distanceOrigin");
    if (length < lowestDist && !courier.data("currentOrder")) {
      lowestDist = length;
      bestCourier = courier;
    }
  }

  if (bestCourier) {
    console.log(`[${printTime(timeMinutes)}] assigned order ${order.id} to ${bestCourier.id()}`);
    bestCourier.data("currentOrder", order);
    cyGraph.traversePath(bestCourier.id(), order.restaurant.id());
    cyGraph.orders.splice(index);
  }
}

//startSimulation();
export { startSimulation };