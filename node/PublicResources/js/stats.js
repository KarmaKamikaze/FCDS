/**
 * Constructor for the simulation statistics object
 */
function simStats() {
  this.simDays = 0;
  this.simTimeMinutes = 0;
  this.simTime = "";
  this.totalOrders = 0;
  this.deliveredOrders = 0;
  this.deliveredOrdersArr = new Array();
  this.pendingOrders = 0;
  this.activeOrders = 0;
  this.failedOrders = 0; /* Not implemented yet due to missing delivery time constraint! */
  this.averageDeliveryTime = 0;
}

/**
 * Calculates the average delivery time of all delivered orders
 * @param {Array} orders The delivered orders array
 * @returns the average delivery time for the delivered orders
 */
function avgDeliveryTime(orders) {
  let avgTime = 0;

  for (let i = 0; i < orders.length; i++) {
    avgTime += orders[i].endTime - orders[i].startTime;
  }
  avgTime /= orders.length;
  return avgTime;
}

export { simStats, avgDeliveryTime };
