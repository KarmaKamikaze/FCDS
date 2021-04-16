import "../../../node_modules/cytoscape/dist/cytoscape.min.js";
import { eleType } from "./graphHelper.js";

function CytoStyle(containerId) {
  return cytoscape({
    container: document.getElementById(containerId),

    // Global settings
    boxSelectionEnabled: false,
    autounselectify: true,
    autoungrabify: true,
    minZoom: 0.12,
    maxZoom: 1.5,

    // Stylesheet
    style: cytoscape
      .stylesheet()
      .selector("node")
      .style({
        content: "data(sumDist)",
        color: "lightgreen",
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
        "background-color": "#d100ff",
      })
      .selector(`.${eleType.courier}`)
      .style({
        width: 55,
        height: 55,
        "background-color": "#B22222",
        content: "data(id)",
      })
      .selector(`.${eleType.customer}`)
      .style({
        width: 60,
        height: 60,
        "background-color": "#89CFF0",
        content: "data(id)",
      })
      .selector(`.${eleType.idlezone_yellow}`)
      .style({
        "background-color": "#FFFF00",
      })
      .selector(`.${eleType.idlezone_orange}`)
      .style({
        "background-color": "#FFA500",
      })
      .selector(`.${eleType.idlezone_red}`)
      .style({
        "background-color": "#DC143C",
        width: 60,
        height: 60,
      })
      .selector(`.${eleType.lunch}`)
      .style({
        "background-color": "#008000",
        width: 80,
        height: 80,
      })
      .selector(`.${eleType.dinner}`)
      .style({
        "background-color": "#4169E1",
        width: 80,
        height: 80,
      }),
  });
}

export { CytoStyle };
