let cy = cytoscape({
    container: document.getElementById('cy'),
  
    boxSelectionEnabled: false,
    autounselectify: true,

    style: cytoscape.stylesheet()
    .selector('node')
      .style({
        'content': 'data(id)',
      })
    .selector('edge')
      .style({
        'curve-style': 'bezier',
        'target-arrow-shape': 'none',
        'width': 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd',
        'content': 'data(id)'
      })
    .selector('.route')
      .style({
        'background-color': '#B22222',
        'line-color': '#B22222',
        'target-arrow-color': '#B22222',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      })
    .selector('.courier')
      .style({
        'width': 20,
        'height':20,
        'color': '#B22222',
        'background-color': '#B22222',
        'content': ''
      })
 });
 
fetch('networks/Aalborg.cyjs')
.then( response => response.json() )
.then( exportedJson => {
  cy.json(exportedJson); // and use the json verbatim
})
.then( () => InitLength() )
.then( () => InitNames() );

cy.autoungrabify( true );
cy.viewport({
  zoom: 1,
  pan: {
    x: 512,
    y: 512
  }
});

let couriers = 0;

function AddNode (nodeId, nodeWeight, xCoord, yCoord) {
  cy.add({
    group: 'nodes',
    data: { weight: nodeWeight,
            id: nodeId,
            parent: null,
            distanceOrigin: 0},
    position: { x: xCoord, y: yCoord }
  });
}

function DelNode (nodeId) {
  let node = cy.getElementById(nodeId).remove()
  return node;
}

function AddCourier (rootNode, usesBike = 1) {
  let node = cy.add({
    group: 'nodes',
    data: { id: ("courier" + ++couriers),
            bike: usesBike},
    position: { x: GetPos(rootNode).x, y: GetPos(rootNode).y}
  });
  node.addClass("courier");
}

function AddEdge (sourceNode, targetNode) {
  cy.add({
      group: 'edges',
      data: { source: sourceNode,
              target: targetNode,
              id: sourceNode + targetNode},
      });
  
  CalcLength (sourceNode + targetNode);
}

function InitLength () {
  let edgeArr = cy.edges()
    for (let i = 0; i < cy.edges().length; i++)
            CalcLength(edgeArr[i].id());
}

function InitNames () {
  let edgeArr = cy.edges()
  for (let i = 0; i < cy.edges().length; i++) {
      let elem = edgeArr[i];
      AddEdge (elem.data("source"), elem.data("target"));
      DelNode(elem.id());
  }
}

function CalcLength (edgeId) {
  let edge = cy.getElementById(edgeId);
  let sourceNode = edge.data("source");
  let targetNode = edge.data("target");
  let pos1 = GetPos(sourceNode);
  let pos2 = GetPos(targetNode);
  let length = Math.sqrt(((pos2.x - pos1.x) * (pos2.x - pos1.x)) + ((pos2.y - pos1.y) * (pos2.y - pos1.y))); 
  edge.data("length", length);
  return length;
}

function GetLength (node1, node2) {
  let edgeArr = cy.getElementById(node1).connectedEdges()
  for (edge in edgeArr)
      if (edgeArr[edge].data("target") === node2 || edgeArr[edge].data("source") === node2)
          return edgeArr[edge].data("length");
}

function MoveNode (nodeID, xcoord, ycoord) {
  cy.getElementById(nodeID).relativePosition({
    x: xcoord,
    y: ycoord});
}

function GetPos (id) {
  return cy.getElementById(id)["_private"].position
}

function GetRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function RandomNode (id) {
    AddNode (id, 0, GetRandomInt(950) - 475, GetRandomInt(950) - 475);
}


function MoveCourier (source, target, node, edge) {
  let diff1 = GetPos(target).x - GetPos(source).x;
  let diff2 = GetPos(target).y - GetPos(source).y;
  let i = 0;
  let steps = GetLength(source,target)*2;
  cy.getElementById(edge).addClass("route");
  let anim = setInterval( () => {
      cy.getElementById(node).shift({x: diff1/steps, y: diff2/steps});
  i++;
  if (i >= steps) {
      clearInterval(anim);
  }
  }, 5);
}

function ListNetwork () {
  let nodes = cy.nodes();
  let netStr = "";
  
  for (let i = 0; i < nodes.length; i++) {
      netStr += ("Node: " + nodes[i].id() + "\n")
      if (nodes[i].connectedEdges().length)
        for (let j = 0; j < nodes[i].connectedEdges().length; j++) {
          netStr += ("Connected edge: " + nodes[i].connectedEdges()[j].id() + "\n");
        }
  }
  console.log(netStr);
}