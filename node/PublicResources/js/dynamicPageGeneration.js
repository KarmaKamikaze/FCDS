export { generateVisualizationHTML, generateGraphDivs, generateOptionsHTML };

/**
 * This function generates the visualization html page, which can then be sent as a response to a GET request.
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
 * @param {String} graphSize The size of the graphs which will be contained in the divs.
 * @param {String} algorithms The different types of algorithms associated with each graph div.
 * @returns A string, which contains the specified amount of graph divs in series. The graph will
 * have an id and three classes associated with it: The cy tag, the size of the graph which will
 * be placed in the div and the algorithm that should be used.
 */
const generateGraphDivs = (graphAmount, graphSize, algorithms) => {
  let graphs = `<div style="text-align: center">`;
  for (let i = 0; i < graphAmount; i++) {
    graphs += `<div id="cy${i}" class="cy ${graphSize} ${algorithms[i]}"></div>`;
  }
  graphs += `</div>`;
  return graphs;
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
  body += pageObject.formaction === "visualization" ? numberOfGraphOption : ``;
  body += `<div class="graph-size">
                  <label for="graph-size">Size of graphs</label>
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
  body +=
    pageObject.formaction === "headless-simulation" ? algorithmOption : ``;
  body += `</div>
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
