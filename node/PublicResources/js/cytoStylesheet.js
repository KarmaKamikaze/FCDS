import { eleType } from "./graphHelper.js";

export function CytoStyle(containerId) {
  return cytoscape({
    container: document.getElementById(containerId),

    // Global settings
    boxSelectionEnabled: false,
    autounselectify: true,
    autoungrabify: true,
    minZoom: 1,
    maxZoom: 1.5,

    // Stylesheet
    style: cytoscape
      .stylesheet()
      .selector("node")
      .style({
        content: "data(id)",
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
        "transition-duration": "0.25s",
      })
      .selector(`.${eleType.routeDone}`)
      .style({
        "background-color": "white",
        "line-color": "white",
        "target-arrow-color": "white",
        "transition-property":
          "background-color, line-color, target-arrow-color",
        "transition-duration": "0.25s",
      })
      .selector(`.${eleType.courier}`)
      .style({
        width: 20,
        height: 20,
        "background-color": "#B22222",
        content: "",
      })
      .selector(`.${eleType.customer}`)
      .style({
        width: 20,
        height: 20,
        "background-color": "#00CED1",
        content: "",
      }),
  });
}
