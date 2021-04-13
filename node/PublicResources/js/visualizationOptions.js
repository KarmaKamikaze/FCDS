const numOfGraphsRadio = document.querySelector("#number-of-graphs");
const graphSizeDiv = document.querySelector("div.graph-size");
const backButton = document.querySelector("#back");
const doneButton = document.querySelector("#done");

// doneButton.addEventListener("click", () => {
//   document.getElementById("options-form").submit();
// });

backButton.addEventListener("click", () => {
  window.history.back();
});

numOfGraphsRadio.addEventListener("change", (event) => {
  simulationAmountMenu(event);
});

const simulationAmountMenu = (event) => {
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
  // A* option
  let firstInput = document.createElement("input");
  firstInput.setAttribute("checked", "");
  firstInput.setAttribute("id", `simulation-${value}-spa-astar`);
  firstInput.setAttribute("name", `simulation-${value}-spa`);
  firstInput.setAttribute("type", `radio`);
  firstInput.setAttribute("value", `astar`);
  firstInput.setAttribute("required", ``);
  radioContainer.appendChild(firstInput);
  // A* label
  let firstLabel = document.createElement("label");
  firstLabel.setAttribute("for", `simulation-${value}-spa-astar`);
  firstLabel.setAttribute("class", `disable-select`);
  firstLabel.appendChild(document.createTextNode(`A*`));
  radioContainer.appendChild(firstLabel);
  // BFS option
  let secondInput = document.createElement("input");
  secondInput.setAttribute("id", `simulation-${value}-spa-bfs`);
  secondInput.setAttribute("name", `simulation-${value}-spa`);
  secondInput.setAttribute("type", `radio`);
  secondInput.setAttribute("value", `bfs`);
  secondInput.setAttribute("required", ``);
  radioContainer.appendChild(secondInput);
  // BFS label
  let secondLabel = document.createElement("label");
  secondLabel.setAttribute("for", `simulation-${value}-spa-bfs`);
  secondLabel.setAttribute("class", `disable-select`);
  secondLabel.appendChild(document.createTextNode(`BFS`));
  radioContainer.appendChild(secondLabel);
  // Dijkstra option
  let thirdInput = document.createElement("input");
  thirdInput.setAttribute("id", `simulation-${value}-spa-dijkstra`);
  thirdInput.setAttribute("name", `simulation-${value}-spa`);
  thirdInput.setAttribute("type", `radio`);
  thirdInput.setAttribute("value", `dijkstra`);
  thirdInput.setAttribute("required", ``);
  radioContainer.appendChild(thirdInput);
  // Dijkstra label
  let thirdLabel = document.createElement("label");
  thirdLabel.setAttribute("for", `simulation-${value}-spa-dijkstra`);
  thirdLabel.setAttribute("class", `disable-select`);
  thirdLabel.appendChild(document.createTextNode(`Dijkstra`));
  radioContainer.appendChild(thirdLabel);

  option.appendChild(radioContainer);

  if (document.querySelector(`div.simulation-${value}-spa`) === null) {
    insertionPoint.after(option);
  }
};
