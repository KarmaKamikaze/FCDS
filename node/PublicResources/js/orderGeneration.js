let timeMinutes = 480;
let tickSpeed = 250;
let orders = [];

export function startSimulation() {
  return setInterval(perTick, tickSpeed);
}

function perTick() {
  let time = timeToFloat(timeMinutes);
  timeMinutes++;

  if (timeMinutes == 1440) {
    timeMinutes = 0;
    // clearInterval(timeTrack);
  }
  let order = generateOrder(time);
  if (order) {
    orders.push(order);
  }
  assignCourier(orders, orders.length, couriers);
  console.log(orders.length);
  console.log("Time: " + printTime(timeMinutes));
}

function timeToFloat(currentMinute) {
  return currentMinute / 60;
}

function printTime(timeMinutes) {
  let string = Math.floor(timeMinutes / 60);
  let minute = timeMinutes % 60;
  string += ":";
  string += minute >= 10 ? minute : "0" + minute;
  return string;
}

function orderIntensity(x) {
  if (x >= 8 && x < 15) {
    return Math.sin(0.86 * x - 2) + 1;
  } else if (x >= 15 && x < 21) {
    return Math.abs(Math.sin(0.5 * x + 2));
  } else {
    return 0;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateOrder(time) {
  let orderWt = orderIntensity(time);
  if (orderWt) {
    let roll = orderWt + getRandomInt(0, 4);
    if (roll > 3) {
      return new Order();
    }
  }
}

function Order(origin, destination) {
  this.restaurant = origin;
  this.customer = destination;
  this.maxDuration = 60;
  this.hasAllergens = Math.random() > 0.95;
}

function assignCourier(orders, index, couriers) {
  let radius = 500;
  let closeCouriers = [];
  let lowestDist = Infinity;
  let bestCourier = null;
  for (courier in couriers) {
    let distRest = Math.hypot(
      getPos(cy.$id(order.restaurant)).x - getPos(courier.id()).x,
      getPos(cy.$id(order.restaurant)).y - getPos(courier.id()).y
    );
    if (distRest < radius) {
      closeCouriers.push(courier);
    }
  }
  for (courier in closeCouriers) {
    dijkstra(cy.elements(), cy.$id(courier.data("currentNode")));
    let length = traceback(cy.elements(), cy.$id(order.restaurant)).length;
    if (length < lowestDist) {
      lowestDist = length;
      bestCourier = courier;
    }
  }
  if (bestCourier) {
    console.log(bestCourier);
    traversePath(bestCourier, order);
    orders.slice(index);
  }
}
