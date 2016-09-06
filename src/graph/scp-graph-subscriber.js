SCP.Graph.Subscriber = function(graph) {
  this.setGraph(graph);
}

SCP.Graph.Subscriber.prototype.setGraph = function(graph) {
  this.graph = graph;
};

SCP.Graph.Subscriber.prototype.update = function(model) {
  this.clearGraph();
  this.addNodes(model);
  this.addEdges(model);
  this.highlightSelected(model);
  this.runLayout();
};

SCP.Graph.Subscriber.prototype.clearGraph = function(model) {
  var graph = this.graph.graph;
  graph.remove("*");
};

SCP.Graph.Subscriber.prototype.addNodes = function(model) {
  var graph = this.graph.graph;
  var nodes = model.graph.nodes;
  for(var node in nodes) {
    var createdNode = {group: 'nodes', classes: '', data: {}};
    createdNode.data.id = node;
    createdNode.data.type = nodes[node].type;
    if (nodes[node].initial)
      createdNode.classes += " initial";
    if (nodes[node].paused)
      createdNode.classes += " paused";
    if (nodes[node].breakpoint)
      createdNode.classes += " breakpoint";
    graph.add(createdNode);
  }
};

SCP.Graph.Subscriber.prototype.addEdges = function(model) {
  var graph = this.graph.graph;
  var edges = model.graph.edges;
  for(var edge in edges) {
    for(var i = 0; i < edges[edge].length; i++) {
      var createdEdge = {group: 'edges'};
      createdEdge.data = edges[edge][i];
      createdEdge.data.source = edge;
      graph.add(createdEdge);
    }
  }
};

SCP.Graph.Subscriber.prototype.highlightSelected = function(model) {
  var currentOperatorNode = this.graph.graph.getElementById(model.getCurrentOperator());
  currentOperatorNode.addClass("selected");
};

SCP.Graph.Subscriber.prototype.runLayout = function() {
  this.graph.graph.elements().layout({ name: 'grid' });
};