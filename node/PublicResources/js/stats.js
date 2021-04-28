/**
 * Constructor for the simulation statistics object
 */
class simStats {
  constructor() {
  this.simDays = 0;
  this.simTime = "";
  this.totalOrdersArr = new Array();
  this.deliveredOrdersArr = new Array();
  this.pendingOrders = 0;
  this.activeOrders = 0;
  this.failedOrders = 0; 
  this.totalDeliveryTime = 0;
  }
  /**
   * Calculates the average delivery time of all delivered orders
   * @returns the average delivery time for the delivered orders
   */
  avgDeliveryTime() {
    return Math.round(this.totalDeliveryTime / this.deliveredOrdersArr.length);
  }
}




export { simStats };
