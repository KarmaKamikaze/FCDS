export { SimStats, updateStats };

// Constant abbreviations of html stat elements
const simDaysStat = document.querySelector("#simulation-days");
const timeStat = document.querySelector("#time");
const simulationRuntimeStat = document.querySelector("#simulation-runtime");
const totalOrdersStat = document.querySelector("#total-orders");
const activeOrdersStat = document.querySelector("#active-orders");
const averageDeliveryTimeStat = document.querySelector("#avg-delivery-time");
const failedOrdersStat = document.querySelector("#failed-orders");
const successRateStat = document.querySelector("#success-rate");
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
    this.simDays = 1; // The current day in simulation
    this.simTimeMinutes = 0; // The current time in simulation
    this.simTime = ""; // 24-hour formatted time in simulation
    this.runtime = 0; // Realtime passed since the simulation was started
    this.simStart = new Date(); // The date at which the simulation was started
    this.totalOrdersArr = new Array(); // An array of all orders that have been present in the graph
    this.deliveredOrdersArr = new Array(); // An array of all orders successfully delivered
    this.pendingOrders = 0; // The number of orders waiting to have a courier assigned
    this.activeOrders = 0; // The number of orders assigned to couriers
    this.failedOrders = 0; // The number of failed orders
    this.averageDeliveryTime = 0; // The average delivery time of orders on the graph
    this.totalDeliveryTime = 0; // Total delivery time
    this.ordersPrinted = 0;
  }

  /**
   * Calculates the average delivery time of all delivered orders
   */
  avgDeliveryTime() {
    this.averageDeliveryTime = Math.round(
      this.totalDeliveryTime / this.deliveredOrdersArr.length
    );
    return this.averageDeliveryTime;
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
  simDaysStat.textContent = simStatObject.simDays;
  timeStat.textContent = simStatObject.simTime;
  totalOrdersStat.textContent = simStatObject.totalOrdersArr.length;
  activeOrdersStat.textContent = simStatObject.activeOrders;
  averageDeliveryTimeStat.textContent = `${simStatObject.averageDeliveryTime.toFixed(
    2
  )} minutes`;
  failedOrdersStat.textContent = simStatObject.failedOrders;
  if (simStatObject.totalOrdersArr.length) {
    successRateStat.textContent =
      (
        (1 - simStatObject.failedOrders / simStatObject.totalOrdersArr.length) *
        100
      ).toFixed(2) + "%";
  }

  // The textarea containing the entire log of orders in the simulation
  if (simStatObject.totalOrdersArr !== null) {
    let data = "";
    for (
      let i = simStatObject.ordersPrinted; // Start the for-loop up to 200 orders before the most recent order.
      i < simStatObject.totalOrdersArr.length;
      i++
    ) {
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
      if (
        simStatObject.totalOrdersArr[i].status !== "pending" &&
        simStatObject.totalOrdersArr[i].status !== "transit"
      ) {
        data += ` - ${simStatObject.totalOrdersArr[i].endTimeClock}`;
      }
      data += `\n`;
    }
    orderTextArea.value = data;

    // Only show the 200 most recent orders
    if (simStatObject.totalOrdersArr.length > 200) {
      simStatObject.ordersPrinted = simStatObject.totalOrdersArr.length - 200;
    }

    // Scrolls to the bottom to watch the newest data added to the field
    if (scrolling) {
      orderTextArea.scrollTop = orderTextArea.scrollHeight;
    }
  }
}
