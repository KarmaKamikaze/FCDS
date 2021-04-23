function lineBreak(element) {
  let br = document.createElement("br");
  document.getElementById(`${element}`).after(br);
}

function addDarkBtn(graphArr) {
  let graphClasses = document.querySelectorAll(".cy"),
    darkBtn = document.createElement("input"),
    documentTheme = "Dark mode";
  darkBtn.type = "button";
  darkBtn.value = "Light mode";
  darkBtn.id = "darkBtn";

  darkBtn.addEventListener("mousedown", function () {
    if (documentTheme == "Light mode") {
      documentTheme = "Dark mode";
      darkBtn.value = "Light mode";
      document.body.style.backgroundColor = "rgb(30,30,30)";
      document.body.style.color = "white";

      graphClasses.forEach(
        (graphClass) => (graphClass.style.backgroundColor = "rgb(30,30,30)")
      );
        
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
      document.getElementById("headless-div").style.color = "white";
      document.getElementById("order-textarea").style.backgroundColor = "black";
    } else {
      documentTheme = "Light mode";
      darkBtn.value = "Dark mode";
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";

      graphClasses.forEach(
        (graphClass) => (graphClass.style.backgroundColor = "white")
      );

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
      document.getElementById("headless-div").style.color = "black";
      document.getElementById("order-textarea").style.backgroundColor = "lightgrey";
    }
  });
  document.getElementById("cy0").before(darkBtn);
  lineBreak(darkBtn.id);
}

export { addDarkBtn };