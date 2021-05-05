export {
  generateVisualizationHTML,
  generateGraphDivs,
  generateOptionsHTML,
  generateHeadlessHTML,
  generateStatInformationDiv,
};

/**
 * This function generates the visualization html page, which can then be sent as a response to a POST request.
 * @param {String} graphs A deposited div html element in string form, representing the graph container
 * @returns A string, which contains the generated visualization.html site.
 */
const generateVisualizationHTML = (graphs) => {
  return `<!DOCTYPE html>
      <html>
        <head>
          <link href="../css/style.css" rel="stylesheet" />
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui"
          />
          <title>Graph Visualization - FCDS</title>
          <link rel="icon" type="image/x-icon" href="../html/favicon.ico" />
        </head>
        <body>
          ${graphs}
          <img class="legend disable-select" src="../html/legend.png" alt="Graph legend reference" title="Graph legend reference">
          <!-- Load application code at the end to ensure DOM is loaded -->
          <script src="../js/graphCore.js" type="module"></script>
          <script src="../js/darkMode.js" type="module"></script>
        </body>
      </html>
      `;
};

/**
 * This function generates an amount of divs to contain graph networks on the html page.
 * @param {Number} graphAmount The number of graph divs to generate. This value is usually
 * requested by the user.
 * @param {String} pageName This value determines the appropriate switch case, since the two end
 * points will need different properties for css reasons.
 * @returns A string, which contains the specified amount of graph divs in series. The graph will
 * have an id and three classes associated with it: The cy tag, the size of the graph which will
 * be placed in the div and the algorithm that should be used.
 */
const generateGraphDivs = (graphAmount, pageName) => {
  switch (pageName) {
    case "visualization":
      let graphs = `<div style="text-align: center">`;
      for (let i = 0; i < graphAmount; i++) {
        graphs += `<div id="cy${i}" class="cy"></div>`;
      }
      graphs += `</div>`;
      return graphs;

    case "headless-simulation":
      let graph = `<div id="cy${graphAmount - 1}" class="cy headless"></div>`;
      return graph;

    default:
      break;
  }
};

/**
 * Generates dynamic HTML file for headless simulation or visual simulation to be served.
 * @param {Object} pageObject contains properties specifying information for requested file.
 * @returns A string which is the dynamically generated HTML file requested.
 */
const generateOptionsHTML = (pageObject) => {
  const numberOfGraphOption = `<div class="number-of-graphs">
        <label for="number-of-graphs"
          >Number of simultaneous graphs</label
        >
        <div id="number-of-graphs" class="radio-container">
          <input
            id="number-of-graphs-1"
            name="number-of-graphs"
            type="radio"
            value="1"
            required
          />
          <label for="number-of-graphs-1" class="disable-select"
            >One</label
          >
          <input
            id="number-of-graphs-2"
            name="number-of-graphs"
            type="radio"
            value="2"
            required
          />
          <label for="number-of-graphs-2" class="disable-select"
            >Two</label
          >
          <input
            id="number-of-graphs-3"
            name="number-of-graphs"
            type="radio"
            value="3"
            required
          />
          <label for="number-of-graphs-3" class="disable-select"
            >Three</label
          >
        </div>
      </div>`;

  const oneGraphOption = `<input
    id="number-of-graphs-1"
    name="number-of-graphs"
    type="hidden"
    value="1"
    checked
    />`;

  const algorithmOption = `<div class="simulation-1-spa">
    <label for="simulation-1-spa">Algorithm</label>
    <div class="radio-container">
      <input
        checked=""
        id="simulation-1-spa-astar"
        name="simulation-1-spa"
        type="radio"
        value="astar"
        required=""
      /><label for="simulation-1-spa-astar" class="disable-select"
        >A*</label
      ><input
        id="simulation-1-spa-bfs"
        name="simulation-1-spa"
        type="radio"
        value="bfs"
        required=""
      /><label for="simulation-1-spa-bfs" class="disable-select"
        >BFS</label
      ><input
        id="simulation-1-spa-dijkstra"
        name="simulation-1-spa"
        type="radio"
        value="dijkstra"
        required=""
      /><label for="simulation-1-spa-dijkstra" class="disable-select"
        >Dijkstra</label
      >
      </div>`;

  let body = `<!DOCTYPE html>
    <html>
      <head>
        <link href="../css/style.css" rel="stylesheet" />
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui"
        />
        <title>${pageObject.title} - FCDS</title>
        <link rel="icon" type="image/x-icon" href="../html/favicon.ico" />
      </head>
      <body>
        <div class="banner">
          <div class="navbar">
            <img src="../html/logo.png" class="logo" />
            <ul>
              <li><a href="/">Home</a></li>
              <li>
                <a href="https://github.com/KarmaKamikaze/P2-Project">Project</a>
              </li>
              <li>
                <a
                  href="https://github.com/KarmaKamikaze/P2-Project/blob/master/README.md"
                  >About</a
                >
              </li>
            </ul>
          </div>
          <form
            class="options-container"
            id="options-form"
            action="/${pageObject.formaction}"
            method="POST"
          >
            <header>
              <h1>Choose your options for the FCDP ${pageObject.h1}</h1>
              <div class="set">`;
  body +=
    pageObject.h1 === "Visualization"
      ? numberOfGraphOption
      : pageObject.h1 === "Simulation"
      ? oneGraphOption
      : ``;

  body += `<div class="graph-size">
                  <label for="graph-size">`;
  body +=
    pageObject.h1 === "Visualization"
      ? `Size of graphs`
      : pageObject.h1 === `Simulation`
      ? `Size of graph`
      : "";
  body += `</label>
                  <div class="radio-container">
                    <input
                      checked=""
                      id="graph-size-small"
                      name="graph-size"
                      type="radio"
                      value="small"
                      required
                    />
                    <label for="graph-size-small" class="disable-select"
                      >Small</label
                    >
                    <input
                      id="graph-size-large"
                      name="graph-size"
                      type="radio"
                      value="large"
                      required
                    />
                    <label for="graph-size-large" class="disable-select"
                      >Large</label
                    >
                  </div>
                </div>`;
  body += pageObject.h1 === "Simulation" ? algorithmOption : ``;

  body += `<div class="slider-container">
          <br>
          <div class="tooltip">Idle zones:
            <span class="tooltiptext">Number of idle zones to generate.</span>
          </div>
          <br>
          <input
            type="range"
            name="idle-zones"
            value="2"
            id="idle-zones"
            min="0"
            max="10"
            step="1"
            oninput="this.nextElementSibling.value = this.value"
          />
          <output>2</output>
          <br>
          <div class="tooltip">Order frequency:
            <span class="tooltiptext">Estimated orders per minute per restaurant at peak times.</span>
          </div>
          <br>
          <input
            type="range"
            name="order-frequency"
            value="0.25"
            id="order-frequency"
            min="0.2"
            max="0.3"
            step="0.01"
            oninput="this.nextElementSibling.value = this.value"
          />
          <output>0.25</output>
          <br>
          <div class="tooltip">Ticks per second:
            <span class="tooltiptext">10 or below for visualization - above 10 for headless.</span>
          </div>
          <br>
          <input
            type="range"
            name="ticks-per-second"
            value="50"
            id="ticks-per-second"
            min="1"
            max="100"
            step="1"
            oninput="this.nextElementSibling.value = this.value"
          />
          <output>50</output>
          <br>
          <div class="tooltip">Courier frequency:
            <span class="tooltiptext">Factor determining the amount of couriers to simulate.</span>
          </div>
          <br>
          <input
            type="range"
            name="courier-frequency"
            value="10"
            id="courier-frequency"
            min="1"
            max="20"
            step="1"
            oninput="this.nextElementSibling.value = this.value"
          />
          <output>10</output>
        </div>
        <br>
          <div class="tooltip">Obstruction level:
            <span class="tooltiptext">Determines the number of edges to create obstructions on periodically.</span>
          </div>
          <br>
          <input
            type="range"
            name="obstruction-level"
            value="5"
            id="obstruction-level"
            min="0"
            max="10"
            step="1"
            oninput="this.nextElementSibling.value = this.value"
          />
          <output>5</output>
        </div>
            </header>
            <footer>
              <div class="set">
                <button type="button" id="back"><span></span>Back</button>
                <button type="submit" id="done"><span></span>Done</button>
              </div>
            </footer>
          </form>
        </div>
    
        <!-- Load application code at the end to ensure DOM is loaded -->
        <script src="../js/visualizationOptions.js" type="module"></script>
      </body>
    </html>
    `;
  return body;
};

/**
 * This function generates the headless-simulation html page, which can then be sent as
 * a response to a POST request.
 * @param {String} graph A deposited div html element in string form, representing the graph container.
 * @param {String} infoDiv A deposited div html element in string form, representing the information stat block.
 * @returns A string, which contains the generated headless-simulation.html site.
 */
const generateHeadlessHTML = (graph, infoDiv) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <link href="../css/style.css" rel="stylesheet" />
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui"
      />
      <title>Headless Simulation - FCDS</title>
      <link rel="icon" type="image/x-icon" href="../html/favicon.ico" />
    </head>
    <body>
    ${graph}
    ${infoDiv}
      <!-- Load application code at the end to ensure DOM is loaded -->
      <script src="../js/graphCore.js" type="module"></script>
      <script src="../js/darkMode.js" type="module"></script>
    </body>
  </html>
  `;
};

/**
 * This function generates an information div to contain the different graph
 * parameters for the ongoing simulation.
 * @param {String} graphSize The size category of the requested graph.
 * @param {String} algorithm The algorithm name for the requested graph.
 * @param {String} pageName The HTML page name to differentiate between visualization
 * and headless.
 * @returns A string containing an information HTML div.
 */
const generateStatInformationDiv = (graphSize, algorithm, pageName = null) => {
  let algorithmName = {
    astar: "A*",
    bfs: "BFS",
    dijkstra: "Dijkstra",
  };
  let sizeName = {
    small: "Small",
    large: "Large",
  };

  let statDiv = `<div id="statistics-div" class="control-center disable-select">
  <h1>Headless simulation</h1>
  <p>Graph size: <span id="graph-size" class="control-value">${
    sizeName[`${graphSize}`]
  }</span></p>
  <p>Current algorithm: <span id="SPA" class="control-value">${
    algorithmName[`${algorithm}`]
  }</span></p>
  <p>Simulation day: <span id="simulation-days" class="control-value"></span></p>
  <p>Time: <span id="time" class="control-value"></span></p>
  <p>Simulation runtime: <span id="simulation-runtime" class="control-value"></span></p>
  <p>Total orders: <span id="total-orders" class="control-value"></span></p>
  <p>Active orders: <span id="active-orders" class="control-value"></span></p>
  <p>Average delivery time: <span id="avg-delivery-time" class="control-value"></span></p>
  <p>Failed orders: <span id="failed-orders" class="control-value"></span></p>
  <p>Success rate: <span id="success-rate" class="control-value"></span></p>`;

  if (pageName === "headless") {
    statDiv += `<div id="orders">
  <textarea readonly name="orders-textarea" id="order-textarea"></textarea>
  </div>`;
  }

  statDiv += `</div>`;

  return statDiv;
};
