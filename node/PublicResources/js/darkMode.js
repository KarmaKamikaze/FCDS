let darkBtn = document.createElement("input");
let documentTheme = "Dark mode";
darkBtn.type = "button";
darkBtn.value = "Light mode";
darkBtn.id = "darkBtn";
darkBtn.addEventListener("mousedown", function () {
    if (documentTheme == "Light mode") {
        document.body.style.backgroundColor = "rgb(30,30,30)";
        document.body.style.color = "white";
        documentTheme = "Dark mode";
        darkBtn.value = "Light mode";
        cy.style().selector('node').style('color', 'white')
        cy.style().selector('edge').style('line-color', 'white')
        cy.style().selector('edge').style('target-arrow-color', 'white')
        cy.style().selector('edge').style('color', 'lightgreen').update()
    }
    else {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
        darkBtn.value = documentTheme;
        documentTheme = "Light mode";
        cy.style().selector('node').style('color', 'black')
        cy.style().selector('edge').style('line-color', 'black')
        cy.style().selector('edge').style('target-arrow-color', 'black')
        cy.style().selector('edge').style('color', 'darkgreen').update()
    }
})
document.getElementById('cy').after(darkBtn);