const numOfGraphsRadio = document.querySelector("#number-of-graphs");
const graphSizeDiv = document.querySelector("div.graph-size");
const backButton = document.querySelector("#back");

// This button will function as a regular back button.
backButton.addEventListener("click", () => {
  window.history.back();
});

// Listen for changes on the html radio elements.
numOfGraphsRadio.addEventListener("change", (event) => {
  simulationMenu(event);
});

/**
 * This function generates and inserts algorithm options on the visualization
 * options html menu depending on the amount graphs that the user wants to
 * include in the simulation.
 * @param {Object} event The event object associated with changes on the
 * radio buttons in the html form.
 */
const simulationMenu = (event) => {
  let value = event.target.value;

  let optionOne = document.querySelector(`div.simulation-1-spa`);
  let optionTwo = document.querySelector(`div.simulation-2-spa`);
  let optionThree = document.querySelector(`div.simulation-3-spa`);

  switch (value) {
    case "1":
      if (optionTwo !== null) optionTwo.remove();
      if (optionThree !== null) optionThree.remove();

      simElementGeneration(value, graphSizeDiv);
      break;
    case "2":
      if (optionThree !== null) optionThree.remove();
      if (optionOne !== null) {
        simElementGeneration(value, optionOne);
      } else {
        simElementGeneration(value - 1, graphSizeDiv);
        simElementGeneration(
          value,
          document.querySelector(`div.simulation-${value - 1}-spa`)
        );
      }
      break;
    case "3":
      if (optionOne !== null && optionTwo !== null) {
        simElementGeneration(value, optionTwo);
      } else if (optionOne !== null) {
        simElementGeneration(value - 1, optionOne);
        simElementGeneration(
          value,
          document.querySelector(`div.simulation-${value - 1}-spa`)
        );
      } else {
        simElementGeneration(value - 2, graphSizeDiv);
        simElementGeneration(
          value - 1,
          document.querySelector(`div.simulation-${value - 2}-spa`)
        );
        simElementGeneration(
          value,
          document.querySelector(`div.simulation-${value - 1}-spa`)
        );
      }
      break;

    default:
      break;
  }
};

/**
 * This function generates a div, containing the algorithm options for
 * the visualization menu.
 * @param {String} value A string, representing the amount of chosen graphs
 * to include. It will be used to determine how many algorithm divs already exist.
 * @param {HTMLDivElement} insertionPoint The insertion point in the html file of
 * the newly generated div.
 */
const simElementGeneration = (value, insertionPoint) => {
  let option = document.createElement("div");
  option.setAttribute("class", `simulation-${value}-spa`);

  let mainLabel = document.createElement("label");
  mainLabel.setAttribute("for", `simulation-${value}-spa`);
  mainLabel.appendChild(
    document.createTextNode(`Simulation ${value} algorithm`)
  );
  option.appendChild(mainLabel);

  let radioContainer = document.createElement("div");
  radioContainer.setAttribute("class", `radio-container`);

  let algorithms = [
    { name: "astar", description: "A*" },
    { name: "bfs", description: "BFS" },
    { name: "dijkstra", description: "Dijkstra" },
  ];

  for (let i = 0; i < 3; i++) {
    createInputAndLabels(radioContainer, value, algorithms[i]);
  }

  option.appendChild(radioContainer);

  if (document.querySelector(`div.simulation-${value}-spa`) === null) {
    insertionPoint.after(option);
  }
};

const createInputAndLabels = (appendPoint, value, algorithm) => {
  let input = document.createElement("input");
  input.setAttribute("id", `simulation-${value}-spa-${algorithm.name}`);
  input.setAttribute("name", `simulation-${value}-spa`);
  input.setAttribute("type", `radio`);
  input.setAttribute("value", `${algorithm.name}`);
  input.setAttribute("required", ``);
  appendPoint.appendChild(input);

  let label = document.createElement("label");
  label.setAttribute("for", `simulation-${value}-spa-${algorithm.name}`);
  label.setAttribute("class", `disable-select`);
  label.appendChild(document.createTextNode(`${algorithm.description}`));
  appendPoint.appendChild(label);
};
