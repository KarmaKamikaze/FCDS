export { SimStats, updateStats };

// Constant abbreviations of html stat elements
const timeStat = document.querySelector("#time");
const simulationRuntimeStat = document.querySelector("#simulation-runtime");
const totalOrdersStat = document.querySelector("#total-orders");
const activeOrdersStat = document.querySelector("#active-orders");
const averageDeliveryTimeStat = document.querySelector("#avg-delivery-time");
const failedOrdersStat = document.querySelector("#failed-orders");
const orderTextArea = document.querySelector("#order-textarea");

// The scrolling value determines if the text field should auto scroll.
let scrolling = true;
if (orderTextArea) {
  orderTextArea.addEventListener("mouseleave", () => (scrolling = true));
  orderTextArea.addEventListener("mouseenter", () => (scrolling = false));
}

/**
 * Constructor for the simulation statistics object
 */
class SimStats {
  constructor() {
    this.simDays = 0; //The amount of days passed in simulation
    this.simTimeMinutes = 0; //The current time in simulation
    this.simTime = ""; //24-hour formatted time in simulation
    this.runtime = 0; //Realtime passed since the simulation was started
    this.simStart = new Date(); //The date at which the simulation was started
    this.totalOrdersArr = new Array(); //An array of all orders that have been present in the graph
    this.deliveredOrdersArr = new Array(); //An array of all orders successfully delivered
    this.pendingOrders = 0; //The number of orders waiting to have a courier assigned
    this.activeOrders = 0; //The number of orders assigned to couriers
    this.failedOrders = 0; // Not implemented yet due to missing delivery time constraint!
    this.averageDeliveryTime = 0; //The average delivery time of orders on the graph
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

  /**
   * Calculates the amount of time the simulation has been running
   */
  calcRuntime() {
    let currentTime = new Date();
    let runtime = currentTime.getTime() - this.simStart.getTime();
    runtime /= 1000;
    this.runtime = Math.floor(runtime);
  }
}

/**
 * Visually updates all the statistics on the headless simulation page
 * @param {Object} simStatObject The statistics object for the current graph
 */
function updateStats(simStatObject) {
  simulationRuntimeStat.textContent = `${simStatObject.runtime} seconds`;
  timeStat.textContent = simStatObject.simTime;
  totalOrdersStat.textContent = simStatObject.totalOrdersArr.length;
  activeOrdersStat.textContent = simStatObject.activeOrders;
  averageDeliveryTimeStat.textContent = `${simStatObject.averageDeliveryTime.toFixed(
    2
  )} minutes`;
  failedOrdersStat.textContent = simStatObject.failedOrders;

  // The textarea containing the entire log of orders in the simulation
  if (simStatObject.totalOrdersArr !== null) {
    let data = "";
    for (let i = 0; i < simStatObject.totalOrdersArr.length; i++) {
      data +=
        ` Order: ${simStatObject.totalOrdersArr[i].id} - ` +
        `Status: ${simStatObject.totalOrdersArr[i].status} - `;

      if (simStatObject.totalOrdersArr[i].status !== "pending") {
        data += `${simStatObject.totalOrdersArr[i].assignedCourier} \u279D `;
      }
      data +=
        `${simStatObject.totalOrdersArr[i].restaurant.data("id")} \u279D ` +
        `${simStatObject.totalOrdersArr[i].customer.data("id")} : ` +
        `Timestamp: ${simStatObject.totalOrdersArr[i].startTimeClock}`;
      if (simStatObject.totalOrdersArr[i].status !== "pending") {
        data += ` - ${simStatObject.totalOrdersArr[i].endTimeClock}`;
      }
      data += `\n`;
    }
    orderTextArea.value = data;

    // Scrolls to the bottom to watch the newest data added to the field
    if (scrolling) {
      orderTextArea.scrollTop = orderTextArea.scrollHeight;
    }
  }
}
