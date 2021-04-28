import "../../../node_modules/cytoscape/dist/cytoscape.min.js";
import { eleType } from "./graphHelper.js";

/**
 * The stylesheet applied to CytoScape networks
 * @param {string} containerId The id of the given graph
 * @param {string} graphSize The size of the graph, either "small" or "large", that the stylesheet is to be applied to
 * @returns The finished stylesheet
 */
function CytoStyle(containerId, graphSize) {
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

export { CytoStyle };
