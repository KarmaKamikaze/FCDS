import "../../../node_modules/cytoscape/dist/cytoscape.min.js";
import { eleType, CyGraph } from "./graphHelper.js";
export { CytoStyle, TestCytoStyle };

/**
 * Applies the stylesheet to the cytoscape graph
 * @param {string} containerId The id of the given graph
 * @param {string} graphSize The size of the graph, either "small" or "large", that the stylesheet is to be applied to
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
  else {
    minZoomVal = 0.12;
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
      .selector(`.${eleType.route}`)
      .style({
        "background-color": "#B22222",
        "line-color": "#B22222",
        "target-arrow-color": "#B22222",
        "transition-property":
          "background-color, line-color, target-arrow-color",
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
  initTestTemplate(template);
  return template;
}

function initTestTemplate(template) {
  for (let i = 0; i < testNodes.length; i++) {
    template.graph.add(testNodes[i]);
  }
  for (let i = 0; i < testEdges.length; i++) {
    template.graph.add(testEdges[i]);
    let id = testEdges[i].data.id,
      src = testEdges[i].data.target,
      target = testEdges[i].data.source;

    template.calcLength(id);
    template.calculateWeight(id);
    template.addEdge(src + target, src, target, testEdges[i].data.obstructions);
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
