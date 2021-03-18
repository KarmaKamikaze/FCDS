let maxSpeedLimit = 130;
 /** 
  * Gives an edge a weight by calculating its property and assigning to weight property 
  * @param {The object for the courier en route} courierObject
  * @param {The edge whose weight is being calculated} edgeObject
  */
  export function weightingFunction(courierObject, edgeObject) {
    edgeObject.weight = ((edgeObject.distance) * (maxSpeedLimit/(Math.max(edgeObject.speedLimit,edgeObject.permObstructions)))); // * (edge.tempObstructions) <- multiply onto when taking traffix and temporary obstructions into account.
    console.log(edgeObject.weight);
  }
  

//Test area below

/* Generates random value for determining traffic and temporary obstructions. Not yet implemented.
const randomNumber = (max) => (Math.floor(Math.random() * max));
*/
 
/**
 * Not implemented yet. Needs to calculate factor for temporary obstructions: traffic and road work, etc.
 */
/* function tempSlowdown() {
 let obstructions;
 let maxTraffic = 60; //navn?
 let maxObstruction = 10;
 let traffic = randomNumber(max);

 if (randomNumber(10) === 9) {
   obstructions = 20;
 }

 if (traffic + obstructions > maxTraffic) {
   return maxTraffic;
 } else {
   return (traffic + obstructions);
 }
} */

//Placeholder for edge
/* 
let edge = {
  distance: 100,
  speedLimit: 50,
  permObstructions: 60,
  weight: 1,
};

//Placeholder for courier
let courier = 2;
  edgesArray = [edge];
*/

/*
//Testing function
 edgesArray.forEach(edge => {
   weightingFunction(courier, edge); 
 });
 */

//Placeholder for edge
/*
let edge = {
    distance: 1000,
    speed_limit: 50,
    perm_obstructions: 1,
    temp_obstructions: tempObstructions(),
    traffic: trafficGeneration(),
    weight: () => (edges.distance *(130 / edges.speedLimit) * edges.traffic * edges.obstructions * edges.intersection);
  }
  */
