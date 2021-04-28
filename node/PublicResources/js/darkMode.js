/**
 * Adds a button to switch between light and dark mode on the simulation pages
 * @param {Array} graphArr The array of all active graphs
 */
function addDarkBtn(graphArr) {
  let graphClasses = document.querySelectorAll(".cy"),
    darkBtn = document.createElement("input"),
    documentTheme = "Dark mode";
  darkBtn.type = "button";
  darkBtn.value = "Light mode";
  darkBtn.id = "darkBtn";

  darkBtn.addEventListener("mousedown", function () {
    //If the theme is light switch every attribute to dark
    if (documentTheme == "Light mode") {
      documentTheme = "Dark mode";
      darkBtn.value = "Light mode";
      document.body.style.backgroundColor = "rgb(30,30,30)";
      document.body.style.color = "white";

      //Background color for the visualized graphs
      graphClasses.forEach(
        (graphClass) => (graphClass.style.backgroundColor = "rgb(30,30,30)")
      );
      
      //Changes color of edges on every graph
      graphArr.forEach((cyGraph) => {
        cyGraph.graph.style().selector("edge").style("line-color", "white");
        cyGraph.graph
          .style()
          .selector("edge")
          .style("target-arrow-color", "white");
        cyGraph.graph
          .style()
          .selector("edge")
          .style("color", "lightgreen")
          .update();
      });
      //Changes colors on the headless simulation page
      document.getElementById("headless-div").style.color = "white";
      document.getElementById("order-textarea").style.backgroundColor = "rgba(0,0,0,0.1)";
      document.getElementById("order-textarea").style.color = "white";
    } else { //If the theme is dark switch every attribute to light
      documentTheme = "Light mode";
      darkBtn.value = "Dark mode";
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";

      //Background color for the visualized graphs
      graphClasses.forEach(
        (graphClass) => (graphClass.style.backgroundColor = "white")
      );

      //Changes color of edges on every graph
      graphArr.forEach((cyGraph) => {
        cyGraph.graph.style().selector("edge").style("line-color", "black");
        cyGraph.graph
          .style()
          .selector("edge")
          .style("target-arrow-color", "black");
        cyGraph.graph
          .style()
          .selector("edge")
          .style("color", "darkgreen")
          .update();
      });

      //Changes colors on the headless simulation page
      document.getElementById("headless-div").style.color = "black";
      document.getElementById("order-textarea").style.backgroundColor = "lightgrey";
      document.getElementById("order-textarea").style.color = "black";
    }
  });
  document.getElementById("cy0").before(darkBtn);
  document.getElementById(darkBtn.id).after(document.createElement("br"));
}

export { addDarkBtn };