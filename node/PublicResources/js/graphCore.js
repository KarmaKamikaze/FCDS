import { CyGraph, eleType } from '../js/graphHelper.js'

let GRAPH_PRESET_FILE = "../graphPresets/TestDijkstra1.cyjs";

let Viewport = {
  width: 768,//parseInt(getComputedStyle(document.querySelector("cy")).width),
  height: 768//parseInt(getComputedStyle(document.querySelector("cy")).height)
};

//TODO: Make general cytoscape settings global - restrict min/max zoom

let cy1 = cytoscape({
    container: document.getElementById('cy1'),
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
    .selector(`.${eleType.route}`)
      .style({
        'background-color': '#B22222',
        'line-color': '#B22222',
        'target-arrow-color': '#B22222',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.25s'
      })
    .selector(`.${eleType.routeDone}`)
      .style({
        'background-color': 'white',
        'line-color': 'white',
        'target-arrow-color': 'white',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.25s'
      })
    .selector(`.${eleType.courier}`)
      .style({
        'width': 20,
        'height':20,
        'background-color': '#B22222',
        'content': ''
      })
    .selector(`.${eleType.customer}`)
      .style({
        'width': 20,
        'height':20,
        'background-color': '#00CED1',
        'content': ''
      })
      //#endregion
});

let cy2 = cytoscape({
  container: document.getElementById('cy2'),
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
  .selector(`.${eleType.route}`)
    .style({
      'background-color': '#B22222',
      'line-color': '#B22222',
      'target-arrow-color': '#B22222',
      'transition-property': 'background-color, line-color, target-arrow-color',
      'transition-duration': '0.25s'
    })
  .selector(`.${eleType.routeDone}`)
    .style({
      'background-color': 'white',
      'line-color': 'white',
      'target-arrow-color': 'white',
      'transition-property': 'background-color, line-color, target-arrow-color',
      'transition-duration': '0.25s'
    })
  .selector(`.${eleType.courier}`)
    .style({
      'width': 20,
      'height':20,
      'background-color': '#B22222',
      'content': ''
    })
  .selector(`.${eleType.customer}`)
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
    .then(response => response.json())
    .then(exportedJson => cyGraph.graph.json(exportedJson))
    // initialize the graph
    .then(function() { 
      cyGraph.initializeEdges();
      cyGraph.initializeNodes();
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
function simulationTest1(cyGraph) {
  cyGraph.addEdge("n2", "center");
  cyGraph.addEdge("end", "center");
  cyGraph.delNode("startend");
  cyGraph.delNode("endstart");
  cyGraph.addCourier("start");
  cyGraph.addCourier("start");
  cyGraph.traversePath("courier1", "center");
  cyGraph.traversePath("courier2", "end");
}

function simulationTest2(cyGraph) {
  cyGraph.addCourier("start");
  cyGraph.addCourier("start");
  cyGraph.traversePath("courier1", "n2");
  cyGraph.traversePath("courier2", "end");
}

/// MAIN ///

let graph1 = new CyGraph(cy1);
let graph2 = new CyGraph(cy2);
SetupGraph(graph1, GRAPH_PRESET_FILE, simulationTest1);
SetupGraph(graph2, GRAPH_PRESET_FILE, simulationTest2);
