import { CyGraph, CLASSES } from '../js/graphHelper.js'

let GRAPH_PRESET_FILE = "../graphPresets/TestDijkstra1.cyjs";

let Viewport = {
  width: parseInt(getComputedStyle(document.getElementById("cy")).width),
  height: parseInt(getComputedStyle(document.getElementById("cy")).height)
};

let cy1 = cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: false,
    autounselectify: true,
    autoungrabify: true,
    //#region Cytoscape Stylesheet
    style: cytoscape.stylesheet()
    .selector('node')
      .style({
        'content': 'data(id)',
        'color': 'white'
      })
    .selector('edge')
      .style({
        'curve-style': 'straight',
        'target-arrow-shape': 'none',
        'width': 3,
        'line-color': 'white',
        'target-arrow-color': 'white',
        'color': 'lightgreen',
        'content': ''
      })
    .selector(`.${CLASSES.CLASS_ROUTE}`)
      .style({
        'background-color': '#B22222',
        'line-color': '#B22222',
        'target-arrow-color': '#B22222',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.25s'
      })
    .selector(`.${CLASSES.CLASS_ROUTE_DONE}`)
      .style({
        'background-color': 'white',
        'line-color': 'white',
        'target-arrow-color': 'white',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.25s'
      })
    .selector(`.${CLASSES.CLASS_COURIER}`)
      .style({
        'width': 20,
        'height':20,
        'background-color': '#B22222',
        'content': ''
      })
    .selector(`.${CLASSES.CLASS_CUSTOMER}`)
      .style({
        'width': 20,
        'height':20,
        'background-color': '#00CED1',
        'content': ''
      })
      //#endregion
});

/**
 * Performs setup and initialization of the input Cytoscape graph
 * @param {CyGraph} cyGraph The CyGraph class to set up
 * @param {File} presetFile The graph preset file to load
 */
function SetupGraph(cyGraph, presetFile = null, startSimulationCallback) {
  if(presetFile === null) return;

  fetch(presetFile)
  .then( response => response.json() )
  .then( exportedJson => cyGraph.graph.json(exportedJson) )
  // initialize the graph
  .then(function() { 
      cyGraph.initializeEdges();
      cyGraph.graph.fit(cyGraph.graph.elements());
      // then call the given start simulation function for this graph
      startSimulationCallback(cyGraph);
  })
  .catch((e) => {
      console.error(e);
  });
}

/** Callback function which starts the simulation once the graph is initialized 
 *  @param {CyGraph} cyGraph The graph to perform the simulation on
*/
function simulationTest(cyGraph) {
  cyGraph.addEdge("n2", "center");
  cyGraph.addEdge("end", "center");
  cyGraph.delNode("startend");
  cyGraph.delNode("endstart");
  cyGraph.addCourier("start");
  cyGraph.addCourier("start");
  cyGraph.traversePath("courier1", "center");
  cyGraph.traversePath("courier2", "end");
}


/// MAIN ///

let graph1 = new CyGraph(cy1);
let courierCount = 0;
SetupGraph(graph1, GRAPH_PRESET_FILE, simulationTest);
