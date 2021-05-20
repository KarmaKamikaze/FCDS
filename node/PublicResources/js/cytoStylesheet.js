import "../../../node_modules/cytoscape/dist/cytoscape.min.js";
import { eleType, CyGraph } from "./graphHelper.js";
export { CytoStyle, TestCytoStyle, TestCytoStyleBFS };

/**
 * Applies the stylesheet to the cytoscape graph
 * @param {string} containerId The id of the given graph
 * @param {string} graphSize The size of the graph, either "small" or "large", that the stylesheet is to be applied to
 * @param {boolean} headless Whether the graph should be rendered or not
 * @returns The finished graph object
 */
function CytoStyle(containerId, graphSize, headless) {
  let minZoomVal, maxZoomVal, allowPanning;

  //Settings specific to the small graph
  if (graphSize == "small") {
    minZoomVal = 1.2;
    maxZoomVal = 1.2;
    allowPanning = false;
  }
  //Settings specific to the large graph
  else if (graphSize == "large") {
    minZoomVal = 0.12;
    maxZoomVal = 1.5;
    allowPanning = true;
  } else {
    minZoomVal = 0.035;
    maxZoomVal = 1.5;
    allowPanning = true;
  }

  return cytoscape({
    container: document.getElementById(containerId),
    headless: headless,

    // Global settings
    boxSelectionEnabled: false,
    autounselectify: true,
    autoungrabify: true,
    minZoom: minZoomVal,
    maxZoom: maxZoomVal,
    userPanningEnabled: allowPanning,

    // Stylesheet
    style: cytoscape
      .stylesheet()
      .selector("node")
      .style({
        content: "data(id)",
        color: "limegreen",
      })
      .selector("edge")
      .style({
        "curve-style": "straight",
        "target-arrow-shape": "none",
        width: 3,
        "line-color": "white",
        "target-arrow-color": "white",
        color: "lightgreen",
        content: "",
      })
      .selector(`.${eleType.inroute}`)
      .style({
        "line-color": "#B22222",
      })
      .selector(`.${eleType.obstructions}`)
      .style({
        "line-color": "#FF8C00",
      })
      .selector(`.${eleType.restaurant}`)
      .style({
        "background-color": "#FFFFFF",
        content: "data(id)",
      })
      .selector(`.${eleType.courier}`)
      .style({
        width: 55,
        height: 55,
        "background-color": "#E0520F",
        color: "#FF5D12",
        content: "data(id)",
      })
      .selector(`.${eleType.customer}`)
      .style({
        width: 60,
        height: 60,
        "background-color": "#976ED7",
        content: "data(id)",
      })
      .selector(`.${eleType.idlezone_yellow}`)
      .style({
        "background-color": "#EADA52",
      })
      .selector(`.${eleType.idlezone_orange}`)
      .style({
        "background-color": "#F39A27",
      })
      .selector(`.${eleType.idlezone_red}`)
      .style({
        "background-color": "#C23B23",
        width: 60,
        height: 60,
      })
      .selector(`.${eleType.lunch}`)
      .style({
        "background-color": "#03AF37",
        width: 80,
        height: 80,
      })
      .selector(`.${eleType.dinner}`)
      .style({
        "background-color": "#579ABE",
        width: 80,
        height: 80,
      }),
  });
}

// Test graph
function TestCytoStyle() {
  let testCy = cytoscape({
    container: null, // container to render in
    headless: true,
  });

  let template = new CyGraph(
    "Test",
    testCy,
    null,
    300,
    0.25,
    true,
    true,
    1,
    20
  );
  initTestTemplate(template, testNodes, testEdges);
  return template;
}

function TestCytoStyleBFS() {
  let testCy = cytoscape({
    container: null, // container to render in
    headless: true,
  });
    
  let template = new CyGraph(
    "TestBFS",
    testCy,
    null,
    300,
    0.25,
    true,
    true,
    1,
    20
  );
  initTestTemplate(template, testNodesBFS, testEdgesBFS);
  return template;
}

function initTestTemplate(template, nodes, edges) {
  for (let i = 0; i < nodes.length; i++) {
    template.graph.add(nodes[i]);
  }
  for (let i = 0; i < edges.length; i++) {
    template.graph.add(edges[i]);
    let id = edges[i].data.id,
      src = edges[i].data.target,
      target = edges[i].data.source;

    template.calcLength(id);
    template.calculateWeight(id);
    template.addEdge(src + target, src, target, edges[i].data.obstructions);
  }
}

let testNodes = [
  {
    data: { id: "R1", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 30, y: -40 },
  },
  {
    data: { id: "N2", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 60, y: -70 },
  },
  {
    data: { id: "N3", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 10, y: -130 },
  },
  {
    data: { id: "N4", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 120, y: -110 },
  },
  {
    data: { id: "C5", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 100, y: -70 },
  },
  {
    data: { id: "N6", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 120, y: -40 },
  },
  {
    data: { id: "N7", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 90, y: -150 },
  },
];

let testEdges = [
  {
    data: {
      id: "R1N2",
      source: "R1",
      target: "N2",
      obstructions: 2.0,
    },
  },
  {
    data: {
      id: "R1N3",
      source: "R1",
      target: "N3",
      obstructions: 1.0,
    },
  },
  {
    data: {
      id: "R1N6",
      source: "R1",
      target: "N6",
      obstructions: 1.0,
    },
  },
  {
    data: {
      id: "N2N3",
      source: "N2",
      target: "N3",
      obstructions: 3.0,
    },
  },
  {
    data: {
      id: "N3N4",
      source: "N3",
      target: "N4",
      obstructions: 1.0,
    },
  },
  {
    data: {
      id: "N4C5",
      source: "N4",
      target: "C5",
      obstructions: 1.0,
    },
  },
];

// Nodes and edges specifically for the greedy BFS algorithm
let testNodesBFS = [
  {
    data: { id: "C1", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 0, y: 200 },
  },
  {
    data: { id: "R1", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 0, y: 0 },
  },
  {
    data: { id: "N1", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: -80, y: 150 },
  },
  {
    data: { id: "N2", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: -30, y: 150 },
  },
  {
    data: { id: "N3", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 30, y: 150 },
  },
  {
    data: { id: "N4", _parent: null, distanceOrigin: 0, weight: 0 },
    position: { x: 30, y: 250 },
  },
];

let testEdgesBFS = [  
  {
    data: {
      id: "N3N2",
      source: "N3",
      target: "N2",
      obstructions: 1.0,
    },
  },
  {
    data: {
      id: "R1N2",
      source: "R1",
      target: "N2",
      obstructions: 1.0,
    },
  },
  {
    data: {
      id: "R1N1",
      source: "R1",
      target: "N1",
      obstructions: 1.0,
    },
  },
  {
    data: {
      id: "N3N4",
      source: "N3",
      target: "N4",
      obstructions: 1.0,
    },
  },
  {
    data: {
      id: "C1N4",
      source: "C1",
      target: "N4",
      obstructions: 1.0,
    },
  },
  {
    data: {
      id: "C1N1",
      source: "C1",
      target: "N1",
      obstructions: 1.0,
    },
  },
];