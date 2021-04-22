export { SimStats, updateStats };

const timeStat = document.querySelector("#time");
const simulationRuntimeStat = document.querySelector("#simulation-runtime");
const totalOrdersStat = document.querySelector("#total-orders");
const activeOrdersStat = document.querySelector("#active-orders");
const averageDeliveryTimeStat = document.querySelector("#avg-delivery-time");
const failedOrdersStat = document.querySelector("#failed-orders");
const orderTextArea = document.querySelector("order-textarea");

/**
 * Constructor for the simulation statistics object
 */
class SimStats {
  constructor() {
    this.simDays = 0;
    this.simTimeMinutes = 0;
    this.simTime = "";
    this.runtime = 0;
    this.simStart = new Date();
    this.totalOrdersArr = new Array();
    this.deliveredOrdersArr = new Array();
    this.pendingOrders = 0;
    this.activeOrders = 0;
    this.failedOrders = 0; /* Not implemented yet due to missing delivery time constraint! */
    this.averageDeliveryTime = 0;
  }

  /**
   * Calculates the average delivery time of all delivered orders
   */
  avgDeliveryTime() {
    let avgTime = 0;

    for (let i = 0; i < this.deliveredOrdersArr.length; i++) {
      avgTime +=
        this.deliveredOrdersArr[i].endTime -
        this.deliveredOrdersArr[i].startTime;
    }
    avgTime /= this.deliveredOrdersArr.length;
    this.averageDeliveryTime = avgTime;
  }

  calcRuntime() {
    let currentTime = new Date();
    let runtime = currentTime.getTime() - this.simStart.getTime();
    runtime /= 1000;
    this.runtime = Math.floor(runtime);
  }
}

function updateStats(simStatObject) {
  simulationRuntimeStat.textContent = `${simStatObject.runtime} seconds`;
  timeStat.textContent = simStatObject.simTime;
  totalOrdersStat.textContent = simStatObject.totalOrdersArr.length;
  activeOrdersStat.textContent = simStatObject.activeOrders;
  averageDeliveryTimeStat.textContent = `${simStatObject.averageDeliveryTime.toFixed(
    2
  )} minutes`;
  failedOrdersStat.textContent = simStatObject.failedOrders;
}
