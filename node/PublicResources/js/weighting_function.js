/** 
 * Genererer tilfældig værdi for traffic som placeholder indtil videre.
 */
const trafficGeneration = () => { Math.floor(Math.random() * Math.floor(100)) };

/** 
 * Giver edge weight ved at ændre på dets weight property baseret på dets andre properties
 * @param {*} courier_object  courrier objectet
 * @param {*} edge_object edges objectet
 */
function weightingFunction(courier_object, edge_object) {
  trafic = trafficGeneration();
  
  edge_object.weight = edge_object.distance * 130/edge_object['speed limit'] * edge_object.traffic * edge_object.obstructions * edge_object.intersection;
}

/** 
 * MAIN
 * Går array af edges igennem og kører weightingFunction for dem.
 */
edges_array.forEach(edge => {
  weightingFunction(courier, edge); 
});
