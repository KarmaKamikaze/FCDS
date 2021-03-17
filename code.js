let cy = cytoscape({
    container: document.getElementById('cy'),
  
    boxSelectionEnabled: false,
    autounselectify: true,

    style: cytoscape.stylesheet()
    .selector('node')
      .style({
        'content': 'data(id)'
      })
    .selector('edge')
      .style({
        'curve-style': 'bezier',
        'target-arrow-shape': 'none',
        'width': 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd'
      })
    .selector('.highlighted')
      .style({
        'background-color': '#61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      })
 });
 
fetch('networks/Aalborg.cyjs')
.then( response => response.json() )
.then( exportedJson => {
  cy.json(exportedJson); // and use the json verbatim
});

cy.autoungrabify( true );
cy.viewport({
  zoom: 1,
  pan: {
    x: 512,
    y: 512
  }
});

function addNode (nodeName, nodeId, nodeWeight, xCoord, yCoord) {
  cy.add({
    group: 'nodes',
    data: { weight: nodeWeight,
            name: nodeName,
            id: nodeId},
    position: { x: xCoord, y: yCoord }
  });
}

function delNode (nodeId) {
  let node = cy.getElementById(nodeId).remove()
  return node;
}

function addEdge (sourceNode, targetNode) {
  cy.add({
      group: 'edges',
      data: { source: sourceNode,
              target: targetNode,
              id: sourceNode + targetNode},
      });
      
  calcDistance (sourceNode + targetNode);
}

function initDistance () {
  let edgeArr = cy.edges()
    for (let i = 0; i < cy.edges().length; i++)
            calcDistance(edgeArr[i].data("id"));
}

function calcDistance (edgeId) {
  let edge = cy.getElementById(edgeId);
  let sourceNode = edge.data("source");
  let targetNode = edge.data("target");
  let pos1 = getPos(sourceNode);
  let pos2 = getPos(targetNode);
  let distance = Math.sqrt(((pos2.x - pos1.x) * (pos2.x - pos1.x)) + ((pos2.y - pos1.y) * (pos2.y - pos1.y))); 
  edge.data("distance", distance);
}

function getDistance (node1, node2) {
  let edgeArr = cy.$("#" + node1).connectedEdges()
  for (edge in edgeArr)
      if (edgeArr[edge].data("target") === node2 || edgeArr[edge].data("source") === node2)
          return edgeArr[edge].data("distance");
}

function moveNode (nodeID, xcoord, ycoord) {
  cy.getElementById(nodeID).relativePosition({
    x: xcoord,
    y: ycoord});
}

function getPos (id) {
  return cy.getElementById(id)["_private"].position
}