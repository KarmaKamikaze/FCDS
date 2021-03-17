// Generates random value for traffic as placeholder for now.
 const trafficGeneration = () => { Math.floor(Math.random() * Math.floor(100)) };

 /** 
  * Gives an edge a weight by calculating its property and assigning to weight property 
  * @param {The object for the courier en route} courier_object
  * @param {The edge whose weight is being calculated} edge_object
  */
 export function weightingFunction(courier_object, edge_object) {
   trafic = trafficGeneration();
   
   edge_object.weight = edge_object.distance * 130/edge_object['speed limit'] * edge_object.traffic * edge_object.obstructions * edge_object.intersection;
 }
 
 /** 
  * MAIN
  * Går array af edges igennem og kører weightingFunction for dem, hvis funktion skal anvendes.
  */
 edges_array.forEach(edge => {
   weightingFunction(courier, edge); 
 });
 
/* kasper
let edges = {
  distance: 1000,
  speedLimit: 50,
  obstructions: 2,
  intersection: 1,
  traffic: trafficGeneration(),
  weight: () => {
    return (edges.distance *(130 / edges.speedLimit) * edges.traffic * edges.obstructions * edges.intersection);
  }
}

console.log(edges.weight());
*/